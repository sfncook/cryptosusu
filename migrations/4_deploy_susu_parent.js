const SusuParent = artifacts.require("SusuParent");
const LATEST_REGISTRY_ADDRESS = 0x5301babd47c45593c88f944ff5a01bfdb577b5fb;

module.exports = function (deployer) {
  deployer.deploy(SusuParent, LATEST_REGISTRY_ADDRESS);
};
