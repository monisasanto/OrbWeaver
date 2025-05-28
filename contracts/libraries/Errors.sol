// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Errors
 * @notice Custom error definitions for gas-efficient error handling
 */
library Errors {
    // Common errors
    error ZeroAddress();
    error Unauthorized();
    error InvalidInput();
    error AlreadyExists();
    error NotFound();
    
    // Schema Registry errors
    error EmptyEntityType();
    error NoFieldsProvided();
    error SchemaNotActive();
    error SchemaNotFound();
    
    // Adapter Registry errors
    error InvalidChainId();
    error AdapterAlreadyExists();
    error AdapterNotFound();
    error AdapterNotActive();
    
    // Query Router errors
    error NoChainsSpecified();
    error InsufficientPayment();
    
    // Reward Module errors
    error InsufficientStake();
    error AlreadyRegistered();
    error NotRegistered();
    error NoVotingPower();
    
    // ZK Verifier errors
    error ProofAlreadyExists();
    error ProofNotFound();
    error InvalidProof();
}

