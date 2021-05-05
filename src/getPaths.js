const path = require('path');
const getInventory = require('@architect/inventory');

module.exports = async function getPaths() {
  const { inv: inventory } = await getInventory({ cwd: path.join(__dirname, '..') });

  // NOTE: no need to worry about inventory.macros, the are not deployed
  return [path.resolve(inventory.shared.src), ...inventory.lambdaSrcDirs];
};
