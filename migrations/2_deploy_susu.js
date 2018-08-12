var Susu = artifacts.require("./SusuOrig.sol");

module.exports = function (deployer) {
    deployer.deploy(Susu, 2, "Test", 1);
};
