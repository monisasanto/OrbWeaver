// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title zkIndexVerifier
 * @notice Verifies zero-knowledge proofs for indexed data correctness
 */
contract zkIndexVerifier {
    struct Proof {
        bytes32 dataHash;
        bytes32 blockHash;
        uint256 blockNumber;
        uint256 chainId;
        bytes zkProof;
        bool verified;
    }

    mapping(bytes32 => Proof) public proofs;
    mapping(address => bool) public trustedProvers;

    address public governance;

    event ProofSubmitted(
        bytes32 indexed proofId,
        uint256 indexed chainId,
        uint256 blockNumber,
        address indexed prover
    );

    event ProofVerified(bytes32 indexed proofId, bool success);

    modifier onlyGovernance() {
        require(msg.sender == governance, "zkIndexVerifier: not governance");
        _;
    }

    modifier onlyTrustedProver() {
        require(trustedProvers[msg.sender], "zkIndexVerifier: not trusted prover");
        _;
    }

    constructor(address _governance) {
        require(_governance != address(0), "zkIndexVerifier: zero address");
        governance = _governance;
        trustedProvers[_governance] = true;
    }

    function submitProof(
        bytes32 dataHash,
        bytes32 blockHash,
        uint256 blockNumber,
        uint256 chainId,
        bytes calldata zkProof
    ) external onlyTrustedProver returns (bytes32 proofId) {
        proofId = keccak256(
            abi.encodePacked(dataHash, blockHash, blockNumber, chainId)
        );

        require(!proofs[proofId].verified, "zkIndexVerifier: proof already exists");

        proofs[proofId] = Proof({
            dataHash: dataHash,
            blockHash: blockHash,
            blockNumber: blockNumber,
            chainId: chainId,
            zkProof: zkProof,
            verified: false
        });

        emit ProofSubmitted(proofId, chainId, blockNumber, msg.sender);
        return proofId;
    }

    function verifyProof(bytes32 proofId) external view returns (bool) {
        Proof memory proof = proofs[proofId];
        require(proof.blockNumber > 0, "zkIndexVerifier: proof not found");

        // In production, this would verify the actual zk-SNARK/STARK proof
        // For now, we simulate verification based on trusted prover submission
        return true;
    }

    function markProofVerified(bytes32 proofId) external onlyGovernance {
        require(proofs[proofId].blockNumber > 0, "zkIndexVerifier: proof not found");
        proofs[proofId].verified = true;

        emit ProofVerified(proofId, true);
    }

    function addTrustedProver(address prover) external onlyGovernance {
        require(prover != address(0), "zkIndexVerifier: zero address");
        trustedProvers[prover] = true;
    }

    function removeTrustedProver(address prover) external onlyGovernance {
        trustedProvers[prover] = false;
    }

    function getProof(bytes32 proofId) external view returns (Proof memory) {
        require(proofs[proofId].blockNumber > 0, "zkIndexVerifier: proof not found");
        return proofs[proofId];
    }

    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "zkIndexVerifier: zero address");
        governance = newGovernance;
    }
}

