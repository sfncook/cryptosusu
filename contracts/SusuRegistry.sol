pragma solidity ^0.4.22;

//import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IRegistry.sol";

// add Ownable
contract SusuRegistry is IRegistry {
    mapping(bytes32 => address) public registry;

    // add onlyOwner
    function put(bytes32 _key, address _contractAddress) external {
        registry[_key] = _contractAddress;
    }

    function get(bytes32 _key) view external returns(address){
        return registry[_key];
    }
}