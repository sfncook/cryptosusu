var SusuParent = artifacts.require("SusuParent");
var SusuRegister = artifacts.require("SusuRegister");

module.exports = function (deployer) {
    deployer.deploy(SusuParent).then((SusuParentContract)=>{
        console.log('SusuParentContract.address:',SusuParentContract.address);
        deployer.deploy(SusuRegister, 'bar').then((SusuRegisterContract)=>{
          SusuRegisterContract.foo().then(foo=>{console.log('SusuRegisterContract.foo:',foo)});
          SusuRegister.deployed().then(instance=>{instance.foo().then(foo=>{console.log('instance.foo:',foo)})});
        });
    });
};
