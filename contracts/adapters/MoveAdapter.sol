// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseAdapter.sol";

/**
 * @title MoveAdapter
 * @notice Adapter for Move-based chains (Aptos, Sui)
 */
contract MoveAdapter is BaseAdapter {
    struct MoveEvent {
        bytes32 moduleAddress;
        string eventType;
        bytes eventData;
        uint64 sequenceNumber;
    }

    mapping(bytes32 => MoveEvent) private indexedMoveEvents;

    constructor(
        address _registry,
        uint256 _chainId,
        string memory _chainName
    ) BaseAdapter(_registry, _chainId, _chainName) {}

    function _processEvent(
        bytes32 eventHash,
        uint256 blockNumber,
        bytes calldata data,
        bytes32 schemaId
    ) internal override {
        MoveEvent memory moveEvent = abi.decode(data, (MoveEvent));
        indexedMoveEvents[eventHash] = moveEvent;
    }

    function mapToSchema(
        bytes calldata rawData,
        bytes32 schemaId
    ) external pure override returns (bytes memory) {
        MoveEvent memory moveEvent = abi.decode(rawData, (MoveEvent));

        return abi.encode(
            moveEvent.moduleAddress,
            moveEvent.eventType,
            moveEvent.eventData,
            moveEvent.sequenceNumber
        );
    }

    function getIndexedMoveEvent(
        bytes32 eventHash
    ) external view returns (MoveEvent memory) {
        return indexedMoveEvents[eventHash];
    }
}

