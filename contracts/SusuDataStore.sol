pragma solidity ^0.4.22;

contract SusuDataStore {
    string public groupName;
    uint256 public contribAmtWei;
    uint8 public groupSize;
    address[] public members;
    uint public memberIdxToPayNext;
    mapping(address => uint) public currentContributions;
}
