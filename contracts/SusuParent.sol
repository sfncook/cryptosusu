pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Susu.sol";
import "./SusuDataStore.sol";
import "./IRegistry.sol";

// is Ownable ?
contract SusuParent {

    IRegistry public registry;

    constructor(address _registry) public {
        registry = IRegistry(_registry);
    }

    // onlyOwner?
    function createSusu(bytes32 _key, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) external {
        address susuOrigAddress = registry.get(_key);
        if(susuOrigAddress == 0x0){
            SusuDataStore susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
            Susu susu = new Susu(susuDataStore, msg.sender);
            registry.put(_key, susu);
            susu.transferOwnership(msg.sender);
        }
    }

    function getSusu(bytes32 _key) view external returns(address) {
        return registry.get(_key);
    }

    // onlyOwner?
//    function upgradeSusu(bytes32 _key) external {
//        address susuAddress = deployedSusus[_key];
//        Susu susu = Susu(susuAddress);
//        SusuDataStore susuDataStore = susu.susuDataStore();
//
//        Susu susuNew = new Susu(susuDataStore, susu.owner());
//
//        susu.kill();
//
//        deployedSusus[_key] = susuNew;
//    }

}
