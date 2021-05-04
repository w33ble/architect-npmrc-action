const core = require('@actions/core');

module.exports = function getContents() {
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
${regString}`.trim();
};
