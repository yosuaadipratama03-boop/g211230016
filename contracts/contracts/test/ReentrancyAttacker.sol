// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEscrow {
    function createProject(uint256, uint16[] calldata, uint64, string calldata) external returns (uint256);
    function fundProject(uint256) external payable;
    function submitMilestoneEvidence(uint256, uint256, bytes32) external;
    function releaseMilestone(uint256, uint256) external;
    function claimRefund(uint256) external;
}

/// @dev TEST ONLY. Tries to re-enter the escrow when it receives ETH.
contract ReentrancyAttacker {
    IEscrow public escrow;
    uint256 public projectId;
    uint256 public milestoneId;
    uint8 public mode; // 1 = re-enter release, 2 = re-enter refund
    bool public reentered;
    bool public reentrySucceeded;

    constructor(address e) { escrow = IEscrow(e); }

    function create(uint256 target, uint16[] calldata bps) external {
        projectId = escrow.createProject(target, bps, 1 days, "attacker");
    }
    function submit(uint256 m, bytes32 h) external { escrow.submitMilestoneEvidence(projectId, m, h); }
    function release(uint256 m, uint8 _mode) external { milestoneId = m; mode = _mode; escrow.releaseMilestone(projectId, m); }
    function fund(uint256 pid) external payable { projectId = pid; escrow.fundProject{value: msg.value}(pid); }
    function refund(uint8 _mode) external { mode = _mode; escrow.claimRefund(projectId); }

    receive() external payable {
        if (reentered) return;
        reentered = true;
        if (mode == 1) {
            try escrow.releaseMilestone(projectId, milestoneId) { reentrySucceeded = true; } catch {}
        } else if (mode == 2) {
            try escrow.claimRefund(projectId) { reentrySucceeded = true; } catch {}
        }
    }
}

/// @dev TEST ONLY. Owner contract that rejects ETH (forces TransferFailed path).
contract RejectingOwner {
    IEscrow public escrow;
    uint256 public projectId;
    constructor(address e) { escrow = IEscrow(e); }
    function create(uint256 target, uint16[] calldata bps) external {
        projectId = escrow.createProject(target, bps, 1 days, "rejecting");
    }
    function submit(uint256 m, bytes32 h) external { escrow.submitMilestoneEvidence(projectId, m, h); }
    function release(uint256 m) external { escrow.releaseMilestone(projectId, m); }
}
