// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Governance
 * @notice Simple governance contract for OrbWeaver protocol
 */
contract Governance {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        address target;
        uint256 value;
        bytes data;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
    }

    uint256 public proposalCount;
    uint256 public votingPeriod = 17280; // ~3 days at 15s blocks
    uint256 public votingDelay = 1;
    uint256 public proposalThreshold = 1e18; // 1 token

    address public timelock;
    mapping(address => uint256) public votingPower;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool support,
        uint256 votes
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);

    constructor(address _timelock) {
        require(_timelock != address(0), "Governance: zero address");
        timelock = _timelock;
    }

    function propose(
        string calldata description,
        address target,
        uint256 value,
        bytes calldata data
    ) external returns (uint256) {
        require(
            votingPower[msg.sender] >= proposalThreshold,
            "Governance: insufficient voting power"
        );

        proposalCount++;
        uint256 proposalId = proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.target = target;
        proposal.value = value;
        proposal.data = data;
        proposal.startBlock = block.number + votingDelay;
        proposal.endBlock = block.number + votingDelay + votingPeriod;

        emit ProposalCreated(proposalId, msg.sender, description);

        return proposalId;
    }

    function castVote(uint256 proposalId, bool support) external {
        require(
            votingPower[msg.sender] > 0,
            "Governance: no voting power"
        );

        Proposal storage proposal = proposals[proposalId];

        require(proposal.id == proposalId, "Governance: invalid proposal");
        require(
            block.number >= proposal.startBlock,
            "Governance: voting not started"
        );
        require(
            block.number <= proposal.endBlock,
            "Governance: voting ended"
        );
        require(
            !proposal.hasVoted[msg.sender],
            "Governance: already voted"
        );

        uint256 votes = votingPower[msg.sender];

        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        proposal.hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, proposalId, support, votes);
    }

    function execute(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];

        require(proposal.id == proposalId, "Governance: invalid proposal");
        require(
            block.number > proposal.endBlock,
            "Governance: voting not ended"
        );
        require(!proposal.executed, "Governance: already executed");
        require(!proposal.canceled, "Governance: proposal canceled");
        require(
            proposal.forVotes > proposal.againstVotes,
            "Governance: proposal not passed"
        );

        proposal.executed = true;

        emit ProposalExecuted(proposalId);
    }

    function setVotingPower(address account, uint256 power) external {
        require(msg.sender == timelock, "Governance: not timelock");
        votingPower[account] = power;
    }
}

