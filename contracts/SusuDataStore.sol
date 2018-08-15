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

    function addMember(address _member) public returns(address[]){
        members.push(_member);
    }

    function getManyMembers() public view returns(uint) {
        return members.length;
    }

    function getMemberAtIndex(uint8 _index) public view returns(address) {
        return members[_index];
    }

}
