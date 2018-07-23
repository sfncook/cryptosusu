var Susu = artifacts.require("./Susu.sol");

module.exports = function (deployer) {
    deployer.deploy(Susu, 2, "Test", 1);
};
