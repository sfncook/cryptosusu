pragma solidity 0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol"

contract Susu {

    address public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;

    constructor(address _susuDataStore, uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        require(_groupSize < MAX_MEMBERS);
        susuDataStore = _susuDataStore;
        groupName = _groupName;
        contribAmtWei = _contribAmtWei;
        groupSize = _groupSize;
        members.push(owner);
        memberIdxToPayNext = 0;
    }


}
