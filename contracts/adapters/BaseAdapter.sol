// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BaseAdapter
 * @notice Base contract for chain-specific adapters
 */
abstract contract BaseAdapter {
    struct EventData {
        bytes32 eventHash;
        uint256 blockNumber;
        uint256 timestamp;
        bytes data;
    }

    address public registry;
    uint256 public chainId;
    string public chainName;

    event DataIndexed(
        bytes32 indexed eventHash,
        uint256 indexed blockNumber,
        bytes32 indexed schemaId
    );

    modifier onlyRegistry() {
        require(msg.sender == registry, "BaseAdapter: not registry");
        _;
    }

    constructor(address _registry, uint256 _chainId, string memory _chainName) {
        require(_registry != address(0), "BaseAdapter: zero address");
        registry = _registry;
        chainId = _chainId;
        chainName = _chainName;
    }

    function indexEvent(
        bytes32 eventHash,
        uint256 blockNumber,
        bytes calldata data,
        bytes32 schemaId
    ) external virtual onlyRegistry returns (bool) {
        _processEvent(eventHash, blockNumber, data, schemaId);
        emit DataIndexed(eventHash, blockNumber, schemaId);
        return true;
    }

    function _processEvent(
        bytes32 eventHash,
        uint256 blockNumber,
        bytes calldata data,
        bytes32 schemaId
    ) internal virtual;

    function mapToSchema(
        bytes calldata rawData,
        bytes32 schemaId
    ) external view virtual returns (bytes memory);

    function getChainInfo() external view returns (uint256, string memory) {
        return (chainId, chainName);
    }
}

