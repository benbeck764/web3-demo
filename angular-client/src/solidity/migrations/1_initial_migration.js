const Web3 = require('web3');
const TruffleConfig = require('../truffle-config');

const AssetTransfer = artifacts.require("./AssetTransfer.sol");
const SimpleStorageTest = artifacts.require("./SimpleStorageTest.sol");
const Token = artifacts.require("./Token.sol");
const BenToken = artifacts.require("./BenToken.sol");
const IoTDemo = artifacts.require("./IoTDemo.sol");

module.exports = function(deployer, network, addresses) {

  const config = TruffleConfig.networks[network];

  if (network === "ethconsortium") {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://' + config.host + ':' + config.port));
    console.log(web3);
    console.log('>> Unlocking account ' + config.from);
    web3.eth.personal.unlockAccount(config.from, "Lollollol764!", 36000);
  }

  //deployer.deploy(BenToken);
  //deployer.deploy(Token);
  //deployer.deploy(AssetTransfer);
  //deployer.deploy(SimpleStorageTest);
  deployer.deploy(IoTDemo);
};