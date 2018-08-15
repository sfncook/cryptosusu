pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol";

contract SusuBizLogic is Ownable {

    SusuDataStore public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;

    constructor(address _susuDataStoreAddress) public {
        susuDataStore = SusuDataStore(_susuDataStoreAddress);
        require(susuDataStore.groupSize() <= MAX_MEMBERS);
        susuDataStore.addMember(owner);
    }

    function getGroupName() public view returns(string) {
        return susuDataStore.getGroupName();
    }

}
