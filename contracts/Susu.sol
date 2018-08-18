pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SusuDataStore.sol";

contract Susu is Ownable {

    using SafeMath for uint;

    SusuDataStore public susuDataStore;
    uint8 constant public MAX_MEMBERS = 5;
    string constant public version = '0.0.14';

    constructor(address _susuDataStoreAddress, address _newOwner) public {
        susuDataStore = SusuDataStore(_susuDataStoreAddress);
        require(susuDataStore.groupSize() <= MAX_MEMBERS);
        susuDataStore.addMember(_newOwner);
    }

    function groupName() external view returns(string) {
        return susuDataStore.groupName();
    }

    function contribAmtWei() public view returns(uint256) {
        return susuDataStore.contribAmtWei();
    }

    function memberIdxToPayNext() public view returns(uint) {
        return susuDataStore.memberIdxToPayNext();
    }

    function groupSize() public view returns(uint8) {
        return susuDataStore.groupSize();
    }

    function pullPayOut() public payable {
        // TODO: require group is full
        // TODO: require everyone has paid
        require(msg.sender == getMemberAtIndex(memberIdxToPayNext()));
        resetBalances();
        iterateMemberToPayNext();
        msg.sender.transfer(getManyMembers() * contribAmtWei());
    }

//    function everyonePaid() private view returns (bool) {
//        for (uint i = 0; i < members.length ; i++)
//        {
//            if(currentContributions[members[i]] != contribAmtWei)
//                return false;
//        }
//        return true;
//    }

    function resetBalances() private {
        for (uint i = 0; i < susuDataStore.getManyMembers(); i++)
        {
            address member = susuDataStore.getMemberAtIndex(i);
            susuDataStore.setContributionForMember(member, 0);
        }
    }

    function iterateMemberToPayNext() private {
        uint _memberIdxToPayNext = susuDataStore.memberIdxToPayNext();
        _memberIdxToPayNext++;
        uint manyMembers = susuDataStore.getManyMembers();
        if(_memberIdxToPayNext == manyMembers) {
            _memberIdxToPayNext = 0;
        }
        susuDataStore.setMemberIdxToPayNext(_memberIdxToPayNext);
        // TODO: Why was there a for-loop here?  Check SusuOrig.  Maybe it is needed?
    }

    function getMemberAtIndex(uint _index) public view returns(address) {
        return susuDataStore.getMemberAtIndex(_index);
    }

    function amIOwner() external view returns(bool) {
        return (msg.sender == owner);
    }

    function getManyMembers() public view returns(uint) {
        return susuDataStore.getManyMembers();
    }

    function joinGroup() external {
        require(!isRecipient(msg.sender));
        susuDataStore.addMember(msg.sender);
    }

    function isRecipient(address addr) private view returns (bool) {
        uint manyMembers = getManyMembers();
        for (uint8 i = 0; i < manyMembers ; i++)
        {
            if(getMemberAtIndex(i) == addr)
                return true;
        }
        return false;
    }

    function getContributionForMember(address _member) external view returns(uint256) {
        return susuDataStore.getContributionForMember(_member);
    }

    function () external payable {
//        require(msg.value == susuDataStore.contribAmtWei());
        require(isRecipient(msg.sender));
        require(susuDataStore.getContributionForMember(msg.sender) == 0);
        susuDataStore.setContributionForMember(msg.sender, msg.value);
    }

    // onlyOwner?
//    function kill() public pure {
//        ???=> var tokenBalance = susuDataStore.balanceOf(this);
//        ???=> tokenLedger.transfer(_upgradedSusu, tokenBalance);
//        ???=> selfdestruct(_upgradedSusu);
//    }

}
