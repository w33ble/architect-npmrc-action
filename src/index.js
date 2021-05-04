const fs = require('fs').promises;
const core = require('@actions/core');
const glob = require('@actions/glob');

function getContents() {
  const registry = core.getInput('registry');
  const token = core.getInput('token');
  const scope = core.getInput('scope');

  core.debug(`Using scope ${scope}`);
  core.debug(`Using registry ${registry}`);

  if (!registry || registry.length === 0) {
    core.setFailed('Registry not provided');
  }

  const authString = token ? `//${registry}/:_authToken=${token}` : '';
  const regString = scope ? `${scope}:registry=${registry}` : `registry=${registry}`;

  return `${authString}
${regString}`;
}

async function getPaths() {
  const globber = await glob.create('**');
  for await (const file of globber.globGenerator()) {
    core.info(file);
  }
}

async function main() {
  const workspace = core.getInput('workspace') ?? '.';
  core.debug(`Using workspace ${workspace}`);

  const filepath = `${workspace}/.npmrc`;
  const content = getContents();
  await fs.writeFile(filepath, content);

  core.info(`Created file at ${filepath}`);
  core.setOutput('filepath', filepath);

  const paths = await getPaths();
  core.info(`Target paths: ${paths.join(', ')}`);
}

main.catch((error) => {
  core.setFailed(error.message);
});
