# Crypto SuSu
The goal of the Crypto Susu project is to create a Ethereum-backed Susu collector.  This is primarily a learning vehicle for the developers involved.

This project is built from the seed of the [Truffle Pet Shop tutorial](https://truffleframework.com/tutorials/pet-shop).  You can find detailed info there and most of it should apply.  The only things I'm planning on changing are the contracts and the web app.  For now all the supporting code will remain the same.

Read [HERE](https://en.wikipedia.org/wiki/Susu_collectors) to learn more about what a "Susu collector".

# Getting Started
 1. Install [Node.js and npm](https://nodejs.org/en/)
 1. Install [Ganache](https://truffleframework.com/ganache/)
 1. Install [Metamask](https://metamask.io/)
 1. Install npm package dependencies.  From the command line `cd` into the root of the cryptosusu project (where ever it happens to be on your development environment). Run this command: `npm install`.  This can take several minutes to run.

#  Compile and Migrate Project
 1. From project root directory compile the truffle project: `truffle compile --all`. (the `--all` option basically forces all contracts to rebuild.  It is optional)
 ```console
 $ truffle compile --all
 Compiling ./contracts/Adoption.sol...
 Compiling ./contracts/Migrations.sol...
 Writing artifacts to ./build/contracts
 ```
 1. Run: `truffle migrate --reset`
 ```console
 $ truffle migrate --reset
 Using network 'development'.
 
 Running migration: 1_initial_migration.js
   Replacing Migrations...
   ... 0xffe2b568322684f649db67510571cad69e9346ea58baa5095e2d40788de1b661
   Migrations: 0xd357f2623ee21345a9d6169df421e2865e3691f0
 Saving successful migration to network...
   ... 0xffb5fb8edae04ad80bb0e5ab8daae39eb2e63d5c4622ddf548914ae8d4a2d237
 Saving artifacts...
 Running migration: 2_deploy_contracts.js
   Replacing Adoption...
   ... 0xa4944431f260acec85f64d573acc8581a2ce94d5166f2216551279dfd3e52ae0
   Adoption: 0xca5cf8411e2d99ddde181d3c5859bd97c2b9317d
 Saving successful migration to network...
   ... 0xbde42314f4533e1d43bcdcbdfd44f62691a10c9b4ed7b2c4d56564515805e791
 Saving artifacts...
 ```
 # Tips and Tricks
 ## Restarting Ganache
 I have found that Metamask does not like it when you restart Ganache because the transaction indexes get out of synch.  So anytime you restart Ganache make sure you "reset account" in the Metamask UI. (you'll have to look around the little Metamask UI for this feature)