const SusuParent = artifacts.require("SusuParent");
const SusuRegistry = artifacts.require("SusuRegistry");
const LATEST_REGISTRY_ADDRESS = SusuRegistry.address;

module.exports = function (deployer) {
  deployer.deploy(SusuParent, LATEST_REGISTRY_ADDRESS);
};
