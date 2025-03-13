/**
 * Truffle configuration file for Ethereum smart contract deployment
 */

module.exports = {
  // Configure networks
  networks: {
    // Development network (default: ganache)
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    
    // Testnet configuration (for when you're ready to deploy to testnet)
    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
    //   network_id: 3,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
  },

  // Configure compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },

  // Configure plugins
  plugins: [
    'truffle-plugin-verify'
  ],

  // Configure contract build directory
  contracts_build_directory: './backend/utils/contracts/build',
  
  // Configure migrations directory
  migrations_directory: './scripts/migrations',
}; 