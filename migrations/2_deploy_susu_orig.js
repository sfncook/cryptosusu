var SusuOrig = artifacts.require("./SusuOrig.sol");

module.exports = function (deployer) {
    deployer.deploy(SusuOrig, 2, "Test", 1);
};
