pragma solidity ^0.4.22;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Susu.sol";

contract TestSusu {
    uint public initialBalance = 1 ether;

    function testConstructorArguments() public {
        Susu susu = new Susu(2, "Test", 1);

        Assert.equal(susu.groupName(), "Test", "Group name should be 'Test'");
        Assert.equal(susu.getManyMembers(), 2, "Number of members should be 2");
        Assert.equal(susu.contribAmtWei(), 1, "Contribution amount should be 1 wei");
    }

    function testOwnerSetToDeployer() public {
        Susu susu = new Susu(2, "Test", 1);

        Assert.equal(susu.owner(), 0x469bbBDf9B0E1610C4DB705f1e6E6D7c4bA9C3b5, toString(susu.owner()));
    }

    function toString(address x) internal pure returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }
}