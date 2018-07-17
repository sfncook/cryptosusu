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
 Running migration: 2_deploy_simpleStorage.js
   Replacing Adoption...
   ... 0xa4944431f260acec85f64d573acc8581a2ce94d5166f2216551279dfd3e52ae0
   Adoption: 0xca5cf8411e2d99ddde181d3c5859bd97c2b9317d
 Saving successful migration to network...
   ... 0xbde42314f4533e1d43bcdcbdfd44f62691a10c9b4ed7b2c4d56564515805e791
 Saving artifacts...
 ```

#  Compile and Migrate Project
 1. From project root directory compile the truffle project: `truffle compile --all`. (the `--all` option basically forces all contracts to rebuild.  It is optional)
 ```console
 $ truffle compile --all
 Compiling ./contracts/Migrations.sol...
 Compiling ./contracts/Susu.sol...
 Writing artifacts to ./build/contracts
 ```
 1. Run: `truffle migrate --reset`
 ```console
 $ truffle migrate --reset
 Using network 'development'.
 
 Running migration: 1_initial_migration.js
   Replacing Migrations...
   ... 0x1520e3b3f002ab9fc31678adce07a9121c18039b39eac1e448cfe6ee77ebde45
   Migrations: 0xd5c94fed9fcbe7e57ad3771e04488d7520116bd6
 Saving successful migration to network...
   ... 0x5863c9a0085157bac6b23f14b0df5dd356bde0e2844178e41aad1941252e5a06
 Saving artifacts...
 Running migration: 3_deploy_susu.js
   Replacing Susu...
   ... 0x3702c690ba46d32c64af0da4d391ac310699064139db936ba58bcb8fda03cabd
   Susu: 0x5256198f56ebe380a77b2a207487c8f4c3e46fbe
 Saving successful migration to network...
   ... 0xd2286e10702e343559be4932fb7bfabe2dc1f1acb312a1e1ccebcb332faa4f5d
 Saving artifacts...
```

# Running CryptoSusu locally
_Presumably you have installed all the prerequisites detailed above including compiling and migrating (i.e. "deploying") the contract to your local blockchain (i.e. Ganache)_
 1. Start [Ganache](https://truffleframework.com/ganache/) (I use the Ganache local app for this.  I'm not sure what the proper cli command would be)
 1. `npm start` Your cli will be cleared and the following output:
 ```console
    Compiled successfully!
    
    The app is running at:
    
      http://localhost:3000/
    
    Note that the development build is not optimized.
    To create a production build, use npm run build.    
```
  This command *should* automatically open http://localhost:3000/ in your default browser, but if not then you can do so manually.
  
## Troubleshooting
 * If you see a blank page try opening the JavaScript development console to look for error messages
 * One common mistake I make is to forget to (re)install [Metamask](https://metamask.io/) (see Tips and Tricks below)
 * If you see some errors in the JS dev console saying something about `MetaMask - RPC Error: Internal JSON-RPC error.` then you maybe forgot to compile and migrate the script (see above)

# Tips and Tricks
## Restarting Ganache
 I have found that Metamask does not like it when you restart Ganache because the transaction indexes get out of synch.  So anytime you restart Ganache make sure you "reset account" in the Metamask UI. (you'll have to look around the little Metamask UI for this feature)