// var Web3 = require('web3');
module.exports = {
  networks: {
    testrpc: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    geth: {
      host: "52.165.165.118",
      port: 8545,
      network_id: "*",    
      gas: 4000000,
      gasPrice: 30000000000,
      //from: "0x21ef82CEB67cC4272C3eA12DF55BF547E0C9872a"
      from: "0xC9Eb462ba704D55D93BDCBF7f1E01F8cf34d4511"
    },
    ethconsortium: {
      host: "13.89.187.9",
      port: 8545,
      network_id: "*",     
      gas: 4000000,
      gasPrice: 30000000000,
      from: ""
    }
  }
};
