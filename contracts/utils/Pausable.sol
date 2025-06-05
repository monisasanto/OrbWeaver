// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Pausable
 * @notice Emergency pause functionality
 */
abstract contract Pausable {
    bool private _paused;
    address public pauser;

    event Paused(address account);
    event Unpaused(address account);
    event PauserTransferred(address indexed previousPauser, address indexed newPauser);

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    modifier onlyPauser() {
        require(msg.sender == pauser, "Pausable: not pauser");
        _;
    }

    constructor() {
        pauser = msg.sender;
        _paused = false;
    }

    function paused() public view returns (bool) {
        return _paused;
    }

    function pause() external onlyPauser whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyPauser whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    function transferPauser(address newPauser) external onlyPauser {
        require(newPauser != address(0), "Pausable: zero address");
        address oldPauser = pauser;
        pauser = newPauser;
        emit PauserTransferred(oldPauser, newPauser);
    }
}

