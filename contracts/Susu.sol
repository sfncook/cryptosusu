pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol";

contract Susu {

    SusuDataStore public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;

    constructor(address _susuDataStoreAddress, uint8 _groupSize) public {
        require(_groupSize < MAX_MEMBERS);
        susuDataStore = SusuDataStore(_susuDataStoreAddress);
//        groupName = _groupName;
//        contribAmtWei = _contribAmtWei;
//        groupSize = _groupSize;
//        members.push(owner);
//        memberIdxToPayNext = 0;
    }


}
