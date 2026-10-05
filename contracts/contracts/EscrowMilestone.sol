// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title EscrowMilestone — EduChain UMKM (WP1, Sepolia Testnet only)
/// @notice Crowdfunding escrow: investor funds are held by this contract and
///         released to the UMKM owner per milestone, only after a verifier approves
///         the milestone evidence (evidence is stored off-chain; only its hash is on-chain).
contract EscrowMilestone is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    uint16 public constant BPS_DENOMINATOR = 10_000; // 100%
    uint8 public constant MAX_MILESTONES = 10;

    enum ProjectStatus { Active, Funded, Completed, Cancelled }
    enum MilestoneStatus { Pending, EvidenceSubmitted, Approved, Released }

    struct Project {
        address owner;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 releasedAmount;
        uint256 refundedAmount;
        uint64 deadline;
        uint64 createdAt;
        uint8 milestoneCount;
        uint8 releasedCount;
        ProjectStatus status;
        string metadataURI;
    }

    struct Milestone {
        uint16 percentageBps;
        MilestoneStatus status;
        bytes32 evidenceHash;
        address approvedBy;
        uint256 releasedAmount;
        bool released;
    }

    uint256 public projectCount;
    mapping(uint256 => Project) private _projects;
    mapping(uint256 => mapping(uint256 => Milestone)) private _milestones;
    mapping(uint256 => mapping(address => uint256)) private _contributions;

    event ProjectCreated(uint256 indexed projectId, address indexed owner, uint256 targetAmount, uint8 milestoneCount, uint64 deadline, string metadataURI);
    event ProjectFunded(uint256 indexed projectId, address indexed investor, uint256 amount, uint256 totalRaised);
    event MilestoneEvidenceSubmitted(uint256 indexed projectId, uint256 indexed milestoneId, bytes32 evidenceHash);
    event MilestoneApproved(uint256 indexed projectId, uint256 indexed milestoneId, address indexed verifier);
    event MilestoneReleased(uint256 indexed projectId, uint256 indexed milestoneId, address indexed owner, uint256 amount);
    event ProjectCancelled(uint256 indexed projectId, address indexed by);
    event Refunded(uint256 indexed projectId, address indexed investor, uint256 amount);

    error InvalidParams();
    error ProjectNotFound();
    error NotProjectOwner();
    error InvalidStatus();
    error InvalidMilestone();
    error AmountInvalid();
    error NothingToRefund();
    error TransferFailed();

    constructor(address admin, address verifier) {
        if (admin == address(0)) revert InvalidParams();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        if (verifier != address(0)) _grantRole(VERIFIER_ROLE, verifier);
    }

    modifier projectExists(uint256 projectId) {
        if (projectId == 0 || projectId > projectCount) revert ProjectNotFound();
        _;
    }

    // ---------------------------------------------------------------- write

    /// @param targetAmount funding target in wei (testnet ETH)
    /// @param milestoneBps allocation of each milestone in basis points; must sum to exactly 10000
    /// @param durationSeconds funding window; after it ends without full funding investors may refund
    function createProject(
        uint256 targetAmount,
        uint16[] calldata milestoneBps,
        uint64 durationSeconds,
        string calldata metadataURI
    ) external whenNotPaused returns (uint256 projectId) {
        uint256 n = milestoneBps.length;
        if (targetAmount == 0 || n == 0 || n > MAX_MILESTONES) revert InvalidParams();
        if (durationSeconds < 1 hours || durationSeconds > 365 days) revert InvalidParams();
        if (bytes(metadataURI).length > 256) revert InvalidParams();

        uint256 total = 0;
        for (uint256 i = 0; i < n; i++) {
            if (milestoneBps[i] == 0) revert InvalidParams();
            total += milestoneBps[i];
        }
        if (total != BPS_DENOMINATOR) revert InvalidParams(); // never more (or less) than 100%

        projectId = ++projectCount;
        Project storage p = _projects[projectId];
        p.owner = msg.sender;
        p.targetAmount = targetAmount;
        p.createdAt = uint64(block.timestamp);
        p.deadline = uint64(block.timestamp) + durationSeconds;
        p.milestoneCount = uint8(n);
        p.status = ProjectStatus.Active;
        p.metadataURI = metadataURI;
        for (uint256 i = 0; i < n; i++) {
            _milestones[projectId][i].percentageBps = milestoneBps[i];
        }
        emit ProjectCreated(projectId, msg.sender, targetAmount, uint8(n), p.deadline, metadataURI);
    }

    /// @notice Investor deposits testnet ETH into escrow. Funds are NOT sent to the owner.
    function fundProject(uint256 projectId) external payable whenNotPaused nonReentrant projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Active || block.timestamp > p.deadline) revert InvalidStatus();
        if (msg.value == 0 || p.raisedAmount + msg.value > p.targetAmount) revert AmountInvalid();
        if (msg.sender == p.owner) revert InvalidParams();

        p.raisedAmount += msg.value;
        _contributions[projectId][msg.sender] += msg.value;
        if (p.raisedAmount == p.targetAmount) p.status = ProjectStatus.Funded;
        emit ProjectFunded(projectId, msg.sender, msg.value, p.raisedAmount);
    }

    function submitMilestoneEvidence(uint256 projectId, uint256 milestoneId, bytes32 evidenceHash)
        external whenNotPaused projectExists(projectId)
    {
        Project storage p = _projects[projectId];
        if (msg.sender != p.owner) revert NotProjectOwner();
        if (p.status != ProjectStatus.Funded) revert InvalidStatus();
        if (milestoneId >= p.milestoneCount) revert InvalidMilestone();
        if (evidenceHash == bytes32(0)) revert InvalidParams();
        Milestone storage m = _milestones[projectId][milestoneId];
        if (m.status != MilestoneStatus.Pending && m.status != MilestoneStatus.EvidenceSubmitted) revert InvalidStatus();

        m.evidenceHash = evidenceHash;
        m.status = MilestoneStatus.EvidenceSubmitted;
        emit MilestoneEvidenceSubmitted(projectId, milestoneId, evidenceHash);
    }

    function approveMilestone(uint256 projectId, uint256 milestoneId)
        external whenNotPaused onlyRole(VERIFIER_ROLE) projectExists(projectId)
    {
        Project storage p = _projects[projectId];
        if (p.status != ProjectStatus.Funded) revert InvalidStatus();
        if (milestoneId >= p.milestoneCount) revert InvalidMilestone();
        Milestone storage m = _milestones[projectId][milestoneId];
        if (m.status != MilestoneStatus.EvidenceSubmitted) revert InvalidStatus();

        m.status = MilestoneStatus.Approved;
        m.approvedBy = msg.sender;
        emit MilestoneApproved(projectId, milestoneId, msg.sender);
    }

    /// @notice Releases an approved milestone's share to the project owner. Callable by owner or verifier.
    function releaseMilestone(uint256 projectId, uint256 milestoneId)
        external whenNotPaused nonReentrant projectExists(projectId)
    {
        Project storage p = _projects[projectId];
        if (msg.sender != p.owner && !hasRole(VERIFIER_ROLE, msg.sender)) revert NotProjectOwner();
        if (p.status != ProjectStatus.Funded) revert InvalidStatus();
        if (milestoneId >= p.milestoneCount) revert InvalidMilestone();
        Milestone storage m = _milestones[projectId][milestoneId];
        if (m.released || m.status != MilestoneStatus.Approved) revert InvalidStatus();

        // Checks done — effects
        uint256 amount = (p.raisedAmount * m.percentageBps) / BPS_DENOMINATOR;
        if (p.releasedCount + 1 == p.milestoneCount) {
            amount = p.raisedAmount - p.releasedAmount; // last milestone takes rounding dust
        }
        m.released = true;
        m.releasedAmount = amount;
        m.status = MilestoneStatus.Released;
        p.releasedAmount += amount;
        p.releasedCount += 1;
        if (p.releasedCount == p.milestoneCount) p.status = ProjectStatus.Completed;
        address owner = p.owner;
        emit MilestoneReleased(projectId, milestoneId, owner, amount);

        // Interaction
        (bool ok, ) = payable(owner).call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /// @notice Owner or admin may cancel only before any milestone has been released.
    function cancelProject(uint256 projectId) external projectExists(projectId) {
        Project storage p = _projects[projectId];
        if (msg.sender != p.owner && !hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) revert NotProjectOwner();
        if (p.status != ProjectStatus.Active && p.status != ProjectStatus.Funded) revert InvalidStatus();
        if (p.releasedAmount != 0) revert InvalidStatus();
        p.status = ProjectStatus.Cancelled;
        emit ProjectCancelled(projectId, msg.sender);
    }

    /// @notice Investor withdraws their own contribution if the project was cancelled,
    ///         or if the funding deadline passed without reaching the target.
    ///         Intentionally NOT pausable so investors can always exit.
    function claimRefund(uint256 projectId) external nonReentrant projectExists(projectId) {
        Project storage p = _projects[projectId];
        bool expired = p.status == ProjectStatus.Active && block.timestamp > p.deadline;
        if (p.status != ProjectStatus.Cancelled && !expired) revert InvalidStatus();
        uint256 amount = _contributions[projectId][msg.sender];
        if (amount == 0) revert NothingToRefund();

        _contributions[projectId][msg.sender] = 0;
        p.refundedAmount += amount;
        emit Refunded(projectId, msg.sender, amount);

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    // ---------------------------------------------------------------- read

    function getProject(uint256 projectId) external view projectExists(projectId) returns (Project memory) {
        return _projects[projectId];
    }

    function getMilestone(uint256 projectId, uint256 milestoneId)
        external view projectExists(projectId) returns (Milestone memory)
    {
        if (milestoneId >= _projects[projectId].milestoneCount) revert InvalidMilestone();
        return _milestones[projectId][milestoneId];
    }

    function getInvestorContribution(uint256 projectId, address investor) external view returns (uint256) {
        return _contributions[projectId][investor];
    }

    /// @dev Reject plain ETH transfers — funding must go through fundProject.
    receive() external payable { revert AmountInvalid(); }
}
