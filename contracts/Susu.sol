pragma solidity ^0.4.22;

import "./SusuBizLogic.sol";
import "./SusuDataStore.sol";

contract Susu {

    mapping(bytes32 => address) public deployedSusus;
    string public foo = "bar";

    function createSusu(bytes32 _key, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public returns(address) {
        SusuDataStore susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
        SusuBizLogic susu = new SusuBizLogic(susuDataStore);
        deployedSusus[_key] = susu;
        return susu;
    }

    function getSusu(bytes32 _key) public constant returns(address) {
        return deployedSusus[_key];
    }

    function getGroupName(bytes32 _key) public view returns(string) {
        address susuAddress = deployedSusus[_key];
        SusuBizLogic susu = SusuBizLogic(susuAddress);
        return susu.getGroupName();
    }

}
