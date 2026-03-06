require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",   // safer with OpenZeppelin
  networks: {
    chainA: {
      url: "http://127.0.0.1:8545"
    },
    chainB: {
      url: "http://127.0.0.1:8546"
    }
  }
};