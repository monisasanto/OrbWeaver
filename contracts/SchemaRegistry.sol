// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/ISchemaRegistry.sol";

/**
 * @title SchemaRegistry
 * @notice Implementation of cross-chain semantic schema registry
 */
contract SchemaRegistry is ISchemaRegistry {
    mapping(bytes32 => Schema) private schemas;
    mapping(bytes32 => Field[]) private schemaFields;
    mapping(string => bytes32[]) private entityTypeSchemas;

    address public governance;
    uint256 public schemaCount;

    modifier onlyGovernance() {
        require(msg.sender == governance, "SchemaRegistry: not governance");
        _;
    }

    constructor(address _governance) {
        require(_governance != address(0), "SchemaRegistry: zero address");
        governance = _governance;
    }

    function registerSchema(
        string calldata entityType,
        Field[] calldata fields
    ) external override returns (bytes32 schemaId) {
        require(bytes(entityType).length > 0, "SchemaRegistry: empty entity type");
        require(fields.length > 0, "SchemaRegistry: no fields provided");

        schemaId = keccak256(
            abi.encodePacked(entityType, msg.sender, block.timestamp, schemaCount)
        );

        Schema storage schema = schemas[schemaId];
        schema.entityType = entityType;
        schema.version = 1;
        schema.creator = msg.sender;
        schema.timestamp = block.timestamp;
        schema.active = true;

        for (uint256 i = 0; i < fields.length; i++) {
            schemaFields[schemaId].push(fields[i]);
        }

        entityTypeSchemas[entityType].push(schemaId);
        schemaCount++;

        emit SchemaRegistered(schemaId, entityType, 1, msg.sender);
        return schemaId;
    }

    function updateSchemaVersion(
        bytes32 schemaId,
        Field[] calldata newFields
    ) external override returns (uint256 newVersion) {
        Schema storage schema = schemas[schemaId];
        require(schema.timestamp > 0, "SchemaRegistry: schema not found");
        require(schema.active, "SchemaRegistry: schema not active");
        require(
            msg.sender == schema.creator || msg.sender == governance,
            "SchemaRegistry: not authorized"
        );
        require(newFields.length > 0, "SchemaRegistry: no fields provided");

        delete schemaFields[schemaId];
        for (uint256 i = 0; i < newFields.length; i++) {
            schemaFields[schemaId].push(newFields[i]);
        }

        schema.version++;
        newVersion = schema.version;

        emit SchemaUpdated(schemaId, newVersion, msg.sender);
        return newVersion;
    }

    function deactivateSchema(bytes32 schemaId) external override {
        Schema storage schema = schemas[schemaId];
        require(schema.timestamp > 0, "SchemaRegistry: schema not found");
        require(
            msg.sender == schema.creator || msg.sender == governance,
            "SchemaRegistry: not authorized"
        );

        schema.active = false;
        emit SchemaDeactivated(schemaId, msg.sender);
    }

    function getSchema(
        bytes32 schemaId
    ) external view override returns (Schema memory) {
        Schema memory schema = schemas[schemaId];
        require(schema.timestamp > 0, "SchemaRegistry: schema not found");

        Field[] memory fields = schemaFields[schemaId];
        schema.fields = fields;

        return schema;
    }

    function getSchemaVersion(
        bytes32 schemaId
    ) external view override returns (uint256) {
        require(schemas[schemaId].timestamp > 0, "SchemaRegistry: schema not found");
        return schemas[schemaId].version;
    }

    function isSchemaActive(
        bytes32 schemaId
    ) external view override returns (bool) {
        return schemas[schemaId].active;
    }

    function getEntitySchemas(
        string calldata entityType
    ) external view returns (bytes32[] memory) {
        return entityTypeSchemas[entityType];
    }

    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "SchemaRegistry: zero address");
        governance = newGovernance;
    }
}

