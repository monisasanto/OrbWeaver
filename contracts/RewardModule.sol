// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRewardModule.sol";

/**
 * @title RewardModule
 * @notice Manages indexer rewards and metrics
 */
contract RewardModule is IRewardModule {
    mapping(address => IndexerMetrics) private indexerMetrics;
    mapping(address => uint256) private indexerStakes;
    mapping(address => bool) private registeredIndexers;

    address public governance;
    uint256 public minimumStake = 1 ether;
    uint256 public totalDistributed;

    modifier onlyGovernance() {
        require(msg.sender == governance, "RewardModule: not governance");
        _;
    }

    modifier onlyRegistered() {
        require(registeredIndexers[msg.sender], "RewardModule: not registered");
        _;
    }

    constructor(address _governance) {
        require(_governance != address(0), "RewardModule: zero address");
        governance = _governance;
    }

    function registerIndexer(uint256 stake) external payable override {
        require(!registeredIndexers[msg.sender], "RewardModule: already registered");
        require(msg.value >= minimumStake, "RewardModule: insufficient stake");
        require(stake >= minimumStake, "RewardModule: stake too low");

        registeredIndexers[msg.sender] = true;
        indexerStakes[msg.sender] = msg.value;

        indexerMetrics[msg.sender] = IndexerMetrics({
            uptime: 0,
            accuracy: 100,
            completionTime: 0,
            queriesServed: 0,
            totalRewards: 0
        });

        emit IndexerRegistered(msg.sender, msg.value);
    }

    function distributeReward(
        address indexer,
        uint256 amount,
        bytes32 queryId
    ) external override onlyGovernance {
        require(registeredIndexers[indexer], "RewardModule: indexer not registered");
        require(amount > 0, "RewardModule: zero amount");

        indexerMetrics[indexer].totalRewards += amount;
        indexerMetrics[indexer].queriesServed++;
        totalDistributed += amount;

        payable(indexer).transfer(amount);

        emit RewardDistributed(indexer, amount, queryId);
    }

    function slashIndexer(
        address indexer,
        uint256 amount,
        string calldata reason
    ) external override onlyGovernance {
        require(registeredIndexers[indexer], "RewardModule: indexer not registered");
        require(
            indexerStakes[indexer] >= amount,
            "RewardModule: insufficient stake"
        );

        indexerStakes[indexer] -= amount;

        emit IndexerSlashed(indexer, amount, reason);
    }

    function getIndexerMetrics(
        address indexer
    ) external view override returns (IndexerMetrics memory) {
        require(registeredIndexers[indexer], "RewardModule: indexer not registered");
        return indexerMetrics[indexer];
    }

    function calculateReward(
        address indexer,
        uint256 queryComplexity
    ) external view override returns (uint256) {
        require(registeredIndexers[indexer], "RewardModule: indexer not registered");

        IndexerMetrics memory metrics = indexerMetrics[indexer];

        uint256 baseReward = queryComplexity * 1e15;
        uint256 accuracyBonus = (baseReward * metrics.accuracy) / 100;

        return baseReward + accuracyBonus;
    }

    function updateMetrics(
        address indexer,
        uint256 uptime,
        uint256 accuracy,
        uint256 completionTime
    ) external onlyGovernance {
        require(registeredIndexers[indexer], "RewardModule: indexer not registered");

        IndexerMetrics storage metrics = indexerMetrics[indexer];
        metrics.uptime = uptime;
        metrics.accuracy = accuracy;
        metrics.completionTime = completionTime;
    }

    function updateMinimumStake(uint256 newMinimum) external onlyGovernance {
        minimumStake = newMinimum;
    }

    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "RewardModule: zero address");
        governance = newGovernance;
    }

    receive() external payable {}
}

