pragma solidity ^0.4.22;

import "./Susu.sol";
import "./SusuDataStore.sol";

contract SusuParent {

    mapping(bytes32 => address) public deployedSusus;

    function createSusu(bytes32 _key, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        if(deployedSusus[_key] == 0x0){
            SusuDataStore susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
            Susu susu = new Susu(susuDataStore, msg.sender);
            deployedSusus[_key] = susu;
            susu.transferOwnership(msg.sender);
        }
    }

    function getSusu(bytes32 _key) public constant returns(address) {
        return deployedSusus[_key];
    }

}
