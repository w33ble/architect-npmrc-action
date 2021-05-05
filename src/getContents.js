const core = require('@actions/core');

module.exports = function getContents() {
  const registry = core.getInput('registry');
  const token = core.getInput('token');
  const scope = core.getInput('scope');

  core.debug(`Using registry ${registry}`);
  core.debug(`Using scope ${scope}`);

  if (!registry || registry.length === 0) {
    throw new Error('Registry not provided');
  }

  const registryUrl = new URL(registry);

  const authString = token ? `//${registryUrl.host}/:_authToken=${token}` : '';
  const regString = scope
    ? `${scope}:registry=${registryUrl.href}`
    : `registry=${registryUrl.href}`;

  return `${authString}
${regString}`.trim();
};
