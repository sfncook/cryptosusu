pragma solidity ^0.4.22;

import './libraries/SafeMath8.sol';
import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";

// API Design here: https://docs.google.com/presentation/d/12qfLPD88TTfvQxWLRTu5boEav8-JdRf3IjpS5WNDTvs/edit#slide=id.g3cb5a7885c_0_11
// Design Requirements here: https://docs.google.com/document/d/1myfOSSwCPx16uUMSLbtf5RvfLFN97vmkKxjFWIvAaEM/edit
contract Susu is Ownable {

    using SafeMath8 for uint8;

    string private groupName;
    uint256 private contribAmtWei;
    address[] private members;
    uint8 private memberIdxToPayNext;
    mapping(address => uint) private currentContributions;

    constructor(uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        groupName = _groupName;
        contribAmtWei = _contribAmtWei;
        members.length = _groupSize;
        members[0] = owner;

        // TODO: This is test data:
        
        // members = [
        //     0x469bbBDf9B0E1610C4DB705f1e6E6D7c4bA9C3b5,
        //     0x461113f2AaE7284649cC53Ba5761668C82Dd587c,
        //     0xE6C22AD8aEB3571d37A87a8C9743d90A4b944884,
        //     0xA363AC0Df8b8B996BA793A1F244D5C499Ae006b4
        // ];
        
        // currentContributions[members[0]] = 10000000000000000;
        // currentContributions[members[1]] = 10000000000000000;
        // currentContributions[members[3]] = 2500000000000000;
    }

    
    function payOut() public payable onlyOwner {
        if(everyonePaid()) {
            resetBalances();
            paySusu();
            iterateMemberToPayNext();
        }
    }

    function everyonePaid() private view returns (bool) {
        for (uint8 i = 0; i < members.length ; i++)
        {
            if(currentContributions[members[i]] != contribAmtWei)
                return false;
        }
        return true;
    }

    function resetBalances() private {
        for (uint8 i = 0; i < members.length ; i++)
        {
            currentContributions[members[i]] = 0;    
        }
    }

    function iterateMemberToPayNext() private {
        for (uint8 i = 0; i < members.length ; i++)
        {
            if(members[i] == members[memberIdxToPayNext]) {
                if(i < members.length - 1) {
                    memberIdxToPayNext = i.add(uint8(1));
                    return;
                }

                memberIdxToPayNext = 0;
                return;
            }
        }
    }

    function paySusu() private {
        members[memberIdxToPayNext].transfer(members.length * contribAmtWei);
    }

    function getContributionAmtWei() public view returns(uint256) {
        return contribAmtWei;
    }

    function getManyMembers() public view returns(uint256) {
        return members.length;
    }

    function getMemberAtIndex(uint8 index) public view returns(address) {
        return members[index];
    }

    function getContributionForMember(address _member) public view returns(uint256) {
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

    // function leaveGroup() public payable {
    //     // TODO
    // }

}