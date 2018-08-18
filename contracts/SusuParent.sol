pragma solidity ^0.4.22;

//import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Susu.sol";
import "./SusuDataStore.sol";
import "./IRegistry.sol";

// is Ownable ?
contract SusuParent {

    IRegistry public registry;
    string constant public version = '0.0.2';

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
        }
    }

    function getSusu(bytes32 _key) view external returns(address) {
        return registry.get(_key);
    }

    // onlyOwner?
    function upgradeSusu(bytes32 _key) external {
        address susuAddressOrig = registry.get(_key);
        Susu susu = Susu(susuAddressOrig);
        Susu susuNew = new Susu(susu.susuDataStore(), susu.owner());
        susu.kill(susuNew);
        registry.put(_key, susuNew);
    }

}
