pragma solidity ^0.4.22;

import "./Susu.sol";
import "./SusuDataStore.sol";

contract SusuParent {

    mapping(bytes32 => address) public deployedSusus;
    string public foo = "bar";

    function createSusu(bytes32 _key, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public returns(address) {
        SusuDataStore susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
        Susu susu = new Susu(susuDataStore);
        deployedSusus[_key] = susu;
        return susu;
    }

    function getSusu(bytes32 _key) public constant returns(address) {
        return deployedSusus[_key];
    }

    function getGroupName(bytes32 _key) public view returns(string) {
        address susuAddress = deployedSusus[_key];
        Susu susu = Susu(susuAddress);
        return susu.getGroupName();
    }

}
