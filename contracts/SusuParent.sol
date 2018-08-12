pragma solidity ^0.4.22;

import "./Susu.sol";
import "./SusuDataStore.sol";

contract SusuParent {

    mapping(bytes32 => address) public deployedSusus;
    string public foo = "bar";

    function createSusu(bytes32 key_, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
//        address susuDataStore = new SusuDataStore(_groupSize, _groupName, _contribAmtWei);
//        address susu = new Susu(susuDataStore);
//        deployedSusus[key_] = susu;
    }
}
