pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol";

contract Susu {

    SusuDataStore public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;

    constructor(address _susuDataStoreAddress) public {
        susuDataStore = SusuDataStore(_susuDataStoreAddress);
        require(susuDataStore.groupSize() <= MAX_MEMBERS);
        //members.push(owner);
    }


}
