const core = require('@actions/core');
const glob = require('@actions/glob');

module.exports = async function getPaths() {
  const globber = await glob.create('**');
  for await (const file of globber.globGenerator()) {
    core.info(file);
  }
};
