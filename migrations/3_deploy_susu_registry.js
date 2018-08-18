const SusuRegistry = artifacts.require("SusuRegistry");

module.exports = function (deployer) {
  deployer.deploy(SusuRegistry);
};
