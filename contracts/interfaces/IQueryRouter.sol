// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IQueryRouter
 * @notice Interface for query routing and resolution
 */
interface IQueryRouter {
    struct QueryRoute {
        bytes32 schemaId;
        uint256[] chainIds;
        address[] adapters;
        uint256 estimatedCost;
    }

    event QueryRouted(
        bytes32 indexed queryId,
        bytes32 indexed schemaId,
        uint256[] chainIds
    );

    function resolveSchema(
        bytes32 schemaId
    ) external view returns (address schemaRegistry);

    function resolveChainAdapter(
        uint256 chainId
    ) external view returns (address adapter);

    function planQuery(
        bytes32 schemaId,
        uint256[] calldata chainIds
    ) external view returns (QueryRoute memory);

    function estimateQueryCost(
        bytes32 schemaId,
        uint256[] calldata chainIds
    ) external view returns (uint256);
}

