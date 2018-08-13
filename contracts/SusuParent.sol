pragma solidity ^0.4.22;

import "./Susu.sol";
import "./SusuDataStore.sol";

contract SusuParent {

    mapping(bytes32 => address) public deployedSusus;
    string public foo = "bar";

    function createSusu(bytes32 _key, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        address susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
        address susu = new Susu(susuDataStore);
        deployedSusus[_key] = susu;
    }

    function getGroupName(bytes32 _key) public view returns(string) {
        Susu susu = Susu(deployedSusus[_key]);
        return susu.getGroupName();
    }

}
