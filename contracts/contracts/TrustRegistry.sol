// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/// @title TrustRegistry — EduChain UMKM (WP1 foundation for WP2/WP3)
/// @notice Stores ONLY hashes/identifiers of Trust Score snapshots and education
///         certificates. No personal data (NIK, phone, address, documents) is stored.
contract TrustRegistry is AccessControl, Pausable {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    enum CertificateStatus { None, Active, Revoked }

    struct TrustScoreRecord {
        bytes32 scoreHash;
        uint64 timestamp;
        uint32 version;
        address recordedBy;
    }

    struct EducationCertificate {
        bytes32 certificateHash;
        CertificateStatus status;
        uint64 timestamp;
        address recordedBy;
    }

    mapping(address => TrustScoreRecord) private _trust;
    mapping(address => EducationCertificate) private _certs;

    event TrustScoreRecorded(address indexed umkm, bytes32 scoreHash, uint32 version, uint64 timestamp);
    event EducationCertificateRecorded(address indexed umkm, bytes32 certificateHash, CertificateStatus status, uint64 timestamp);

    error InvalidParams();

    constructor(address admin, address registrar) {
        if (admin == address(0)) revert InvalidParams();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        if (registrar != address(0)) _grantRole(REGISTRAR_ROLE, registrar);
    }

    function recordTrustScoreHash(address umkm, bytes32 scoreHash)
        external whenNotPaused onlyRole(REGISTRAR_ROLE)
    {
        if (umkm == address(0) || scoreHash == bytes32(0)) revert InvalidParams();
        TrustScoreRecord storage r = _trust[umkm];
        r.scoreHash = scoreHash;
        r.timestamp = uint64(block.timestamp);
        r.version += 1;
        r.recordedBy = msg.sender;
        emit TrustScoreRecorded(umkm, scoreHash, r.version, r.timestamp);
    }

    function recordEducationCertificate(address umkm, bytes32 certificateHash, CertificateStatus status)
        external whenNotPaused onlyRole(REGISTRAR_ROLE)
    {
        if (umkm == address(0) || status == CertificateStatus.None) revert InvalidParams();
        if (status == CertificateStatus.Active && certificateHash == bytes32(0)) revert InvalidParams();
        EducationCertificate storage c = _certs[umkm];
        if (certificateHash != bytes32(0)) c.certificateHash = certificateHash;
        c.status = status;
        c.timestamp = uint64(block.timestamp);
        c.recordedBy = msg.sender;
        emit EducationCertificateRecorded(umkm, c.certificateHash, status, c.timestamp);
    }

    function getTrustScoreRecord(address umkm) external view returns (TrustScoreRecord memory) {
        return _trust[umkm];
    }

    function getEducationCertificate(address umkm) external view returns (EducationCertificate memory) {
        return _certs[umkm];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
