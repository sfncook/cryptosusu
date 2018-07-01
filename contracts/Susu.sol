pragma solidity ^0.4.22;

// API Design here: https://docs.google.com/presentation/d/12qfLPD88TTfvQxWLRTu5boEav8-JdRf3IjpS5WNDTvs/edit#slide=id.g3cb5a7885c_0_11
// Design Requirements here: https://docs.google.com/document/d/1myfOSSwCPx16uUMSLbtf5RvfLFN97vmkKxjFWIvAaEM/edit
contract Susu {
    address owner;
    uint8 public groupSize;
    uint256 contribAmtWei;
    address[] members;
    mapping(address => uint) currentContributions;

    constructor() public payable {
        owner = msg.sender;

        // TODO: This is test data:
        groupSize = 4;
        contribAmtWei = 10000000000000000;
        members = [
            0x469bbBDf9B0E1610C4DB705f1e6E6D7c4bA9C3b5,
            0x461113f2AaE7284649cC53Ba5761668C82Dd587c,
            0xE6C22AD8aEB3571d37A87a8C9743d90A4b944884,
            0xA363AC0Df8b8B996BA793A1F244D5C499Ae006b4
        ];
        currentContributions[members[0]] = 10000000000000000;
        currentContributions[members[1]] = 10000000000000000;
        currentContributions[members[3]] = 2500000000000000;
    }

    // Owner only
    function setGroupSize(uint8 _groupSize) public {
        require(msg.sender == owner);
        groupSize = _groupSize;
    }

    // Owner only
    function setContributionAmtWei(uint256 _contribAmtWei) public {
        require(msg.sender == owner);
        contribAmtWei = _contribAmtWei;
    }

    // Owner only
    function payOut() public payable {
        require(msg.sender == owner);
    }

    function getContributionAmtWei() public view returns(uint256) {
        return contribAmtWei;
    }

    function getMembers() public view returns(address[]) {
        return members;
    }

    function getCurrentContribution(address _member) public view returns(uint256) {
        return currentContributions[_member];
    }

    function amIOwner() public view returns(bool) {
        return (msg.sender == owner);
    }

    function joinGroup() public pure {
        // TODO: Implement and remove "pure" spec which was added to get rid of compiler warning
    }

    function contribute() public payable {
        // TODO
    }

    function leaveGroup() public payable {
        // TODO
    }

}