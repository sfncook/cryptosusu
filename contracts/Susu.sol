pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";

// API Design here: https://docs.google.com/presentation/d/12qfLPD88TTfvQxWLRTu5boEav8-JdRf3IjpS5WNDTvs/edit#slide=id.g3cb5a7885c_0_11
// Design Requirements here: https://docs.google.com/document/d/1myfOSSwCPx16uUMSLbtf5RvfLFN97vmkKxjFWIvAaEM/edit
contract Susu is Ownable {

    using SafeMath for uint;

    string public groupName;
    uint256 public contribAmtWei;
    uint8 public groupSize;
    address[] public members;
    uint public membersJoined;
    uint public memberIdxToPayNext;
    uint8 public maxMembers;
    mapping(address => uint) private currentContributions;

    constructor(uint8 _groupSize, string _groupName, uint256 _contribAmtWei) public {
        // Max number of members is 100. Arbitrary but should be smaller than max of uint8
        require(_groupSize < 100);
        groupName = _groupName;
        contribAmtWei = _contribAmtWei;
        groupSize = _groupSize;
        members.push(owner);
        membersJoined = 1;
        maxMembers = 100;
        memberIdxToPayNext = 0;
    }

    function payOut() public payable onlyOwner {
        if(everyonePaid()) {
            resetBalances();
            paySusu();
            iterateMemberToPayNext();
        }
    }

    function everyonePaid() private view returns (bool) {
        for (uint i = 0; i < members.length ; i++)
        {
            if(currentContributions[members[i]] != contribAmtWei)
                return false;
        }
        return true;
    }

    function resetBalances() private {
        for (uint i = 0; i < members.length ; i++)
        {
            currentContributions[members[i]] = 0;    
        }
    }

    function iterateMemberToPayNext() private {
        for (uint i = 0; i < members.length ; i++)
        {
            if(members[i] == members[memberIdxToPayNext]) {
                if(i < members.length - 1) {
                    memberIdxToPayNext = i.add(1);
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

    function getMemberAtIndex(uint8 index) public view returns(address) {
        return members[index];
    }

    function getContributionForMember(address _member) public view returns(uint256) {
        return currentContributions[_member];
    }

    function amIOwner() public view returns(bool) {
        return (msg.sender == owner);
    }

    function getManyMembers() public view returns(uint) {
        return members.length;
    }
    
    function joinGroup() public {
        require(!isRecipient(msg.sender));
        members.push(msg.sender);
//        members[membersJoined] = msg.sender;
//        membersJoined = membersJoined.add(1);
    }

    function contribute() public payable {
        require(msg.value == contribAmtWei);
        require(isRecipient(msg.sender));
//        require(membersJoined == members.length);

        TrackPayment();
    }

    function TrackPayment() private {
        require(currentContributions[msg.sender] == 0);
        currentContributions[msg.sender] = msg.value;
    }

    function isRecipient(address addr) private view returns (bool) {
        for (uint i = 0; i < members.length ; i++)
        {
            if(members[i] == addr)
                return true;
        }
        return false;
    }

    function () external payable {
        contribute();
    }
    // function leaveGroup() public payable {
    //     // TODO
    // }

}