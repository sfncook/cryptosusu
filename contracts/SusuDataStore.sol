pragma solidity ^0.4.22;

contract SusuDataStore {
    string public groupName;
    uint256 public contribAmtWei;
    uint8 public groupSize;
    address[] public members;
    uint public memberIdxToPayNext = 0;
    mapping(address => uint) public currentContributions;

    constructor(uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        groupName = _groupName;
        contribAmtWei = _contribAmtWei;
        groupSize = _groupSize;
    }

    function addMember(address _member) external {
        members.push(_member);
    }

    function getManyMembers() external view returns(uint) {
        return members.length;
    }

    function getMemberAtIndex(uint _index) external view returns(address) {
        return members[_index];
    }

    function getContributionForMember(address _member) external view returns(uint256) {
        return currentContributions[_member];
    }

    function setContributionForMember(address _member, uint256 _contribAmtWei) external {
        currentContributions[_member] = _contribAmtWei;
    }

    function setMemberIdxToPayNext(uint _memberIdxToPayNext) external {
        memberIdxToPayNext = _memberIdxToPayNext;
    }

}
