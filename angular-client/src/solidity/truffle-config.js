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
      //from: "0x21ef82CEB67cC4272C3eA12DF55BF547E0C9872a" TEST
      from: "0xC9Eb462ba704D55D93BDCBF7f1E01F8cf34d4511" // Geth Single Node Miner
      //from: "0x436b4d151be96148a204516384ae50d36a334d0e" // Token Account

    },
    geth2: {
      host: "52.165.165.118",
      port: 8545,
      network_id: "*",    
      gas: 4000000,
      gasPrice: 30000000000,
      from: "0xDA974E5B1969589Ef011Cb3C611668A434413f05" // Geth Single Node Miner

    },
    ethconsortium: {
      host: "104.43.214.223",
      port: 8545,
      network_id: "*",     
      gas: 4000000,
      gasPrice: 30000000000,
      from: "0x840334C80dF7a1EE4aFaa77E2b0d4E30128dbd09"
    }
  }
};
