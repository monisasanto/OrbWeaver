// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISchemaRegistry
 * @notice Interface for managing cross-chain semantic schemas
 */
interface ISchemaRegistry {
    struct Field {
        string name;
        string fieldType;
        bool required;
    }

    struct Schema {
        string entityType;
        Field[] fields;
        uint256 version;
        address creator;
        uint256 timestamp;
        bool active;
    }

    event SchemaRegistered(
        bytes32 indexed schemaId,
        string entityType,
        uint256 version,
        address indexed creator
    );

    event SchemaUpdated(
        bytes32 indexed schemaId,
        uint256 newVersion,
        address indexed updater
    );

    event SchemaDeactivated(bytes32 indexed schemaId, address indexed actor);

    function registerSchema(
        string calldata entityType,
        Field[] calldata fields
    ) external returns (bytes32 schemaId);

    function updateSchemaVersion(
        bytes32 schemaId,
        Field[] calldata newFields
    ) external returns (uint256 newVersion);

    function deactivateSchema(bytes32 schemaId) external;

    function getSchema(bytes32 schemaId) external view returns (Schema memory);

    function getSchemaVersion(bytes32 schemaId) external view returns (uint256);

    function isSchemaActive(bytes32 schemaId) external view returns (bool);
}

