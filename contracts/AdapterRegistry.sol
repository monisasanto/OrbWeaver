// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAdapterRegistry.sol";

/**
 * @title AdapterRegistry
 * @notice Implementation of per-chain adapter registry
 */
contract AdapterRegistry is IAdapterRegistry {
    mapping(uint256 => AdapterInfo) private adapters;
    uint256[] private registeredChainIds;

    address public governance;

    modifier onlyGovernance() {
        require(msg.sender == governance, "AdapterRegistry: not governance");
        _;
    }

    constructor(address _governance) {
        require(_governance != address(0), "AdapterRegistry: zero address");
        governance = _governance;
    }

    function registerAdapter(
        uint256 chainId,
        address adapterContract,
        string calldata chainName
    ) external override onlyGovernance {
        require(chainId > 0, "AdapterRegistry: invalid chain ID");
        require(adapterContract != address(0), "AdapterRegistry: zero address");
        require(
            adapters[chainId].adapterContract == address(0),
            "AdapterRegistry: adapter already exists"
        );

        adapters[chainId] = AdapterInfo({
            adapterContract: adapterContract,
            chainName: chainName,
            chainId: chainId,
            active: true,
            registeredAt: block.timestamp
        });

        registeredChainIds.push(chainId);

        emit AdapterRegistered(chainId, adapterContract, chainName);
    }

    function updateAdapter(
        uint256 chainId,
        address newAdapterContract
    ) external override onlyGovernance {
        require(
            adapters[chainId].adapterContract != address(0),
            "AdapterRegistry: adapter not found"
        );
        require(newAdapterContract != address(0), "AdapterRegistry: zero address");

        address oldAdapter = adapters[chainId].adapterContract;
        adapters[chainId].adapterContract = newAdapterContract;

        emit AdapterUpdated(chainId, oldAdapter, newAdapterContract);
    }

    function deactivateAdapter(uint256 chainId) external override onlyGovernance {
        require(
            adapters[chainId].adapterContract != address(0),
            "AdapterRegistry: adapter not found"
        );

        adapters[chainId].active = false;

        emit AdapterDeactivated(chainId);
    }

    function getAdapter(uint256 chainId) external view override returns (address) {
        require(
            adapters[chainId].adapterContract != address(0),
            "AdapterRegistry: adapter not found"
        );
        require(adapters[chainId].active, "AdapterRegistry: adapter not active");

        return adapters[chainId].adapterContract;
    }

    function getAdapterInfo(
        uint256 chainId
    ) external view override returns (AdapterInfo memory) {
        require(
            adapters[chainId].adapterContract != address(0),
            "AdapterRegistry: adapter not found"
        );

        return adapters[chainId];
    }

    function isAdapterActive(
        uint256 chainId
    ) external view override returns (bool) {
        return adapters[chainId].active;
    }

    function getAllChainIds() external view returns (uint256[] memory) {
        return registeredChainIds;
    }

    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "AdapterRegistry: zero address");
        governance = newGovernance;
    }
}

