// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IQueryRouter.sol";
import "./interfaces/ISchemaRegistry.sol";
import "./interfaces/IAdapterRegistry.sol";

/**
 * @title QueryRouter
 * @notice Routes queries to appropriate chains and adapters
 */
contract QueryRouter is IQueryRouter {
    address public schemaRegistry;
    address public adapterRegistry;
    address public governance;

    uint256 public baseCostPerChain = 0.001 ether;

    mapping(bytes32 => QueryRoute) private queryCache;

    modifier onlyGovernance() {
        require(msg.sender == governance, "QueryRouter: not governance");
        _;
    }

    constructor(
        address _schemaRegistry,
        address _adapterRegistry,
        address _governance
    ) {
        require(_schemaRegistry != address(0), "QueryRouter: zero schema registry");
        require(_adapterRegistry != address(0), "QueryRouter: zero adapter registry");
        require(_governance != address(0), "QueryRouter: zero governance");

        schemaRegistry = _schemaRegistry;
        adapterRegistry = _adapterRegistry;
        governance = _governance;
    }

    function resolveSchema(
        bytes32 schemaId
    ) external view override returns (address) {
        return schemaRegistry;
    }

    function resolveChainAdapter(
        uint256 chainId
    ) external view override returns (address) {
        return IAdapterRegistry(adapterRegistry).getAdapter(chainId);
    }

    function planQuery(
        bytes32 schemaId,
        uint256[] calldata chainIds
    ) external view override returns (QueryRoute memory) {
        require(chainIds.length > 0, "QueryRouter: no chains specified");

        ISchemaRegistry registry = ISchemaRegistry(schemaRegistry);
        require(registry.isSchemaActive(schemaId), "QueryRouter: schema not active");

        address[] memory adapters = new address[](chainIds.length);
        for (uint256 i = 0; i < chainIds.length; i++) {
            adapters[i] = IAdapterRegistry(adapterRegistry).getAdapter(chainIds[i]);
        }

        uint256 estimatedCost = baseCostPerChain * chainIds.length;

        return QueryRoute({
            schemaId: schemaId,
            chainIds: chainIds,
            adapters: adapters,
            estimatedCost: estimatedCost
        });
    }

    function estimateQueryCost(
        bytes32 schemaId,
        uint256[] calldata chainIds
    ) external view override returns (uint256) {
        require(chainIds.length > 0, "QueryRouter: no chains specified");

        ISchemaRegistry registry = ISchemaRegistry(schemaRegistry);
        require(registry.isSchemaActive(schemaId), "QueryRouter: schema not active");

        return baseCostPerChain * chainIds.length;
    }

    function updateBaseCost(uint256 newCost) external onlyGovernance {
        baseCostPerChain = newCost;
    }

    function updateSchemaRegistry(address newRegistry) external onlyGovernance {
        require(newRegistry != address(0), "QueryRouter: zero address");
        schemaRegistry = newRegistry;
    }

    function updateAdapterRegistry(address newRegistry) external onlyGovernance {
        require(newRegistry != address(0), "QueryRouter: zero address");
        adapterRegistry = newRegistry;
    }

    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "QueryRouter: zero address");
        governance = newGovernance;
    }
}

