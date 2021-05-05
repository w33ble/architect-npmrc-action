const fs = require('fs').promises;
const path = require('path');
const core = require('@actions/core');
const getContents = require('./getContents');
const getPaths = require('./getPaths');

async function main() {
  const workspace = core.getInput('workspace') ?? '.';
  core.debug(`Using workspace ${workspace}`);

  const filepath = path.resolve(__dirname, `../${workspace}/.npmrc`);
  const content = getContents();
  await fs.writeFile(filepath, content);

  core.info(`Created file at ${filepath}`);
  core.setOutput('filepath', filepath);

  const paths = await getPaths();
  core.info(`Target paths: ${paths.join(', ')}`);

  await Promise.all(
    paths.map(async (p) => {
      const target = `${p}/.npmrc`;
      core.debug(`Copy file: ${filepath} -> ${target}`);
      await fs.copyFile(filepath, target);
    })
  );
}

main().catch((error) => {
  core.setFailed(error.message);
});
