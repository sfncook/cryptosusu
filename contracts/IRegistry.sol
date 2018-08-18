pragma solidity ^0.4.22;

interface IRegistry {
    function put(bytes32 _key, address _contractAddress) external;
    function get(bytes32 _key) view external returns(address);
}
