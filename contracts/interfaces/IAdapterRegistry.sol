// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAdapterRegistry
 * @notice Interface for managing per-chain adapters
 */
interface IAdapterRegistry {
    struct AdapterInfo {
        address adapterContract;
        string chainName;
        uint256 chainId;
        bool active;
        uint256 registeredAt;
    }

    event AdapterRegistered(
        uint256 indexed chainId,
        address indexed adapterContract,
        string chainName
    );

    event AdapterUpdated(
        uint256 indexed chainId,
        address indexed oldAdapter,
        address indexed newAdapter
    );

    event AdapterDeactivated(uint256 indexed chainId);

    function registerAdapter(
        uint256 chainId,
        address adapterContract,
        string calldata chainName
    ) external;

    function updateAdapter(
        uint256 chainId,
        address newAdapterContract
    ) external;

    function deactivateAdapter(uint256 chainId) external;

    function getAdapter(uint256 chainId) external view returns (address);

    function getAdapterInfo(
        uint256 chainId
    ) external view returns (AdapterInfo memory);

    function isAdapterActive(uint256 chainId) external view returns (bool);
}

