var AssetTransfer = artifacts.require("./AssetTransfer.sol");
var SimpleStorageTest = artifacts.require("./SimpleStorageTest.sol");

module.exports = function(deployer) {
  deployer.deploy(AssetTransfer);
  deployer.deploy(SimpleStorageTest);
};
