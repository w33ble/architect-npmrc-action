const path = require('path');
const getInventory = require('@architect/inventory');

module.exports = async function getPaths() {
  const { inv: inventory } = await getInventory({ cwd: path.join(__dirname, '..') });

  // NOTE: no need to worry about inventory.macros, the are not deployed
  const sharedPath = inventory.shared != null ? [path.resolve(inventory.shared.src)] : [];

  if (inventory.lambdaSrcDirs == null) {
    if (sharedPath.length === 0) {
      throw new Error('No lambdas found in project');
    }

    return sharedPath;
  }

  return sharedPath.concat(inventory.lambdaSrcDirs);
};
