// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseAdapter.sol";

/**
 * @title EVMAdapter
 * @notice Adapter for EVM-compatible chains
 */
contract EVMAdapter is BaseAdapter {
    struct EVMEvent {
        address contractAddress;
        bytes32 eventSignature;
        bytes32[] topics;
        bytes data;
    }

    mapping(bytes32 => EVMEvent) private indexedEvents;

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
        EVMEvent memory evmEvent = abi.decode(data, (EVMEvent));
        indexedEvents[eventHash] = evmEvent;
    }

    function mapToSchema(
        bytes calldata rawData,
        bytes32 schemaId
    ) external pure override returns (bytes memory) {
        EVMEvent memory evmEvent = abi.decode(rawData, (EVMEvent));

        return abi.encode(
            evmEvent.contractAddress,
            evmEvent.eventSignature,
            evmEvent.topics,
            evmEvent.data
        );
    }

    function getIndexedEvent(
        bytes32 eventHash
    ) external view returns (EVMEvent memory) {
        return indexedEvents[eventHash];
    }
}

