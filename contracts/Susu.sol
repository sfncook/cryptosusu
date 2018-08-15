pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol";

contract Susu is Ownable {

    SusuDataStore public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;

    constructor(address _susuDataStoreAddress, address _newOwner) public {
        susuDataStore = SusuDataStore(_susuDataStoreAddress);
        require(susuDataStore.groupSize() <= MAX_MEMBERS);
        susuDataStore.addMember(_newOwner);
    }

    function groupName() public view returns(string) {
        return susuDataStore.groupName();
    }


//    function pullPayOut() public payable {
//        require(msg.sender == members[memberIdxToPayNext]);
//        resetBalances();
//        iterateMemberToPayNext();
//        msg.sender.transfer(members.length * contribAmtWei);
//    }
//
//    function everyonePaid() private view returns (bool) {
//        for (uint i = 0; i < members.length ; i++)
//        {
//            if(currentContributions[members[i]] != contribAmtWei)
//                return false;
//        }
//        return true;
//    }
//
//    function resetBalances() private {
//        for (uint i = 0; i < members.length ; i++)
//        {
//            currentContributions[members[i]] = 0;
//        }
//    }
//
//    function iterateMemberToPayNext() private {
//        for (uint i = 0; i < members.length ; i++)
//        {
//            if(members[i] == members[memberIdxToPayNext]) {
//                if(i < members.length - 1) {
//                    memberIdxToPayNext = i.add(1);
//                    return;
//                }
//
//                memberIdxToPayNext = 0;
//                return;
//            }
//        }
//    }

    function getMemberAtIndex(uint8 _index) public view returns(address) {
        return susuDataStore.getMemberAtIndex(_index);
    }

//    function getContributionForMember(address _member) public view returns(uint256) {
//        return currentContributions[_member];
//    }

    function amIOwner() public view returns(bool) {
        return (msg.sender == owner);
    }

    function getManyMembers() public view returns(uint) {
        return susuDataStore.getManyMembers();
    }
//
//    function joinGroup() public {
//        require(!isRecipient(msg.sender));
//        members.push(msg.sender);
//    }
//
//    function isRecipient(address addr) private view returns (bool) {
//        for (uint i = 0; i < members.length ; i++)
//        {
//            if(members[i] == addr)
//                return true;
//        }
//        return false;
//    }
//
//    function () external payable {
//        require(msg.value == contribAmtWei);
//        require(isRecipient(msg.sender));
//        require(currentContributions[msg.sender] == 0);
//        currentContributions[msg.sender] = msg.value;
//    }

}
