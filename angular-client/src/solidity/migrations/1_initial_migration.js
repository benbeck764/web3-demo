const Web3 = require('web3');
const TruffleConfig = require('../truffle-config');

const AssetTransfer = artifacts.require("./AssetTransfer.sol");
const SimpleStorageTest = artifacts.require("./SimpleStorageTest.sol");
const Token = artifacts.require("./Token.sol");
const BenToken = artifacts.require("./BenToken.sol");

module.exports = function(deployer, network, addresses) {

  const config = TruffleConfig.networks[network];

  if (process.env.ACCOUNT_PASSWORD) {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://' + config.host + ':' + config.port));
    console.log('>> Unlocking account ' + config.from);
    web3.personal.unlockAccount(config.from, process.env.ACCOUNT_PASSWORD, 36000);
  }

  //deployer.deploy(BenToken);
  //deployer.deploy(Token);
  //deployer.deploy(AssetTransfer);
  deployer.deploy(SimpleStorageTest);
};