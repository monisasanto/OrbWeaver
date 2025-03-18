// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Timelock
 * @notice Timelock controller for governance actions
 */
contract Timelock {
    uint256 public constant MINIMUM_DELAY = 2 days;
    uint256 public constant MAXIMUM_DELAY = 30 days;
    uint256 public constant GRACE_PERIOD = 14 days;

    address public admin;
    uint256 public delay;

    mapping(bytes32 => bool) public queuedTransactions;

    event NewAdmin(address indexed newAdmin);
    event NewDelay(uint256 indexed newDelay);
    event QueueTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    event ExecuteTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    event CancelTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Timelock: not admin");
        _;
    }

    constructor(address _admin, uint256 _delay) {
        require(_delay >= MINIMUM_DELAY, "Timelock: delay too short");
        require(_delay <= MAXIMUM_DELAY, "Timelock: delay too long");

        admin = _admin;
        delay = _delay;
    }

    function setDelay(uint256 _delay) external onlyAdmin {
        require(_delay >= MINIMUM_DELAY, "Timelock: delay too short");
        require(_delay <= MAXIMUM_DELAY, "Timelock: delay too long");

        delay = _delay;
        emit NewDelay(_delay);
    }

    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Timelock: zero address");

        admin = _newAdmin;
        emit NewAdmin(_newAdmin);
    }

    function queueTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external onlyAdmin returns (bytes32) {
        require(
            eta >= block.timestamp + delay,
            "Timelock: ETA must exceed delay"
        );

        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        queuedTransactions[txHash] = true;

        emit QueueTransaction(txHash, target, value, signature, data, eta);
        return txHash;
    }

    function cancelTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external onlyAdmin {
        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        queuedTransactions[txHash] = false;

        emit CancelTransaction(txHash, target, value, signature, data, eta);
    }

    function executeTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external payable onlyAdmin returns (bytes memory) {
        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );

        require(
            queuedTransactions[txHash],
            "Timelock: transaction not queued"
        );
        require(
            block.timestamp >= eta,
            "Timelock: transaction not ready"
        );
        require(
            block.timestamp <= eta + GRACE_PERIOD,
            "Timelock: transaction expired"
        );

        queuedTransactions[txHash] = false;

        bytes memory callData;
        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(
                bytes4(keccak256(bytes(signature))),
                data
            );
        }

        (bool success, bytes memory returnData) = target.call{value: value}(
            callData
        );
        require(success, "Timelock: transaction execution failed");

        emit ExecuteTransaction(txHash, target, value, signature, data, eta);

        return returnData;
    }
}

