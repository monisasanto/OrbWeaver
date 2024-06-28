// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRewardModule
 * @notice Interface for indexer reward distribution
 */
interface IRewardModule {
    struct IndexerMetrics {
        uint256 uptime;
        uint256 accuracy;
        uint256 completionTime;
        uint256 queriesServed;
        uint256 totalRewards;
    }

    event RewardDistributed(
        address indexed indexer,
        uint256 amount,
        bytes32 indexed queryId
    );

    event IndexerRegistered(address indexed indexer, uint256 stake);

    event IndexerSlashed(address indexed indexer, uint256 amount, string reason);

    function registerIndexer(uint256 stake) external;

    function distributeReward(
        address indexer,
        uint256 amount,
        bytes32 queryId
    ) external;

    function slashIndexer(
        address indexer,
        uint256 amount,
        string calldata reason
    ) external;

    function getIndexerMetrics(
        address indexer
    ) external view returns (IndexerMetrics memory);

    function calculateReward(
        address indexer,
        uint256 queryComplexity
    ) external view returns (uint256);
}

