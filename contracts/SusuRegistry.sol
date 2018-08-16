pragma solidity ^0.4.22;

import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IRegistry.sol";

contract SusuRegistry is IRegistry, Ownable {
    mapping(bytes32 => address) public registry;

    function put(bytes32 _key, address _contractAddress) external onlyOwner {
        registry[_key] = _contractAddress;
    }

    function get(bytes32 _key) view external returns(address){
        return registry[_key];
    }
}