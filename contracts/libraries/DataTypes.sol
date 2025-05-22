// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DataTypes
 * @notice Common data types used across contracts
 */
library DataTypes {
    struct Field {
        string name;
        string fieldType;
        bool required;
    }

    struct SchemaInfo {
        bytes32 schemaId;
        string entityType;
        uint256 version;
        bool active;
    }

    struct ChainInfo {
        uint256 chainId;
        string name;
        address adapter;
        bool active;
    }

    struct QueryRequest {
        bytes32 queryId;
        bytes32 schemaId;
        uint256[] chainIds;
        address requester;
        uint256 timestamp;
    }

    struct IndexerInfo {
        address indexerAddress;
        uint256 stake;
        uint256 uptime;
        uint256 accuracy;
        bool active;
    }
}

