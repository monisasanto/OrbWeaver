// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseAdapter.sol";

/**
 * @title CosmWasmAdapter
 * @notice Adapter for CosmWasm-based chains
 */
contract CosmWasmAdapter is BaseAdapter {
    struct WasmEvent {
        string contractAddress;
        string eventType;
        bytes attributes;
        uint256 height;
    }

    mapping(bytes32 => WasmEvent) private indexedWasmEvents;

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
        WasmEvent memory wasmEvent = abi.decode(data, (WasmEvent));
        indexedWasmEvents[eventHash] = wasmEvent;
    }

    function mapToSchema(
        bytes calldata rawData,
        bytes32 schemaId
    ) external pure override returns (bytes memory) {
        WasmEvent memory wasmEvent = abi.decode(rawData, (WasmEvent));

        return abi.encode(
            wasmEvent.contractAddress,
            wasmEvent.eventType,
            wasmEvent.attributes,
            wasmEvent.height
        );
    }

    function getIndexedWasmEvent(
        bytes32 eventHash
    ) external view returns (WasmEvent memory) {
        return indexedWasmEvents[eventHash];
    }
}

