// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    // Struct to store document details
    struct Document {
        uint256 id;
        uint256 productId;
        string documentType; // e.g., "Certificate of Origin", "Quality Inspection", "Customs Declaration"
        string documentHash; // IPFS hash or other storage reference
        uint256 timestamp;
        address issuedBy;
        bool isVerified;
        address verifiedBy;
        uint256 verificationTimestamp;
    }

    // Mapping from document ID to Document
    mapping(uint256 => Document) private documents;
    // Mapping from product ID to array of document IDs
    mapping(uint256 => uint256[]) private productDocuments;
    // Mapping of authorized verifiers
    mapping(address => bool) private verifiers;
    
    uint256 private documentCount;
    address private owner;

    // Events
    event DocumentAdded(uint256 indexed documentId, uint256 indexed productId, string documentType);
    event DocumentVerified(uint256 indexed documentId, address verifiedBy);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner, "Only authorized verifiers can call this function");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true;
        documentCount = 0;
    }

    // Verifier management
    function addVerifier(address _verifier) public onlyOwner {
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) public onlyOwner {
        require(_verifier != owner, "Cannot remove owner as verifier");
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    // Document management
    function addDocument(
        uint256 _productId,
        string memory _documentType,
        string memory _documentHash
    ) public returns (uint256) {
        documentCount++;
        uint256 documentId = documentCount;
        
        documents[documentId] = Document({
            id: documentId,
            productId: _productId,
            documentType: _documentType,
            documentHash: _documentHash,
            timestamp: block.timestamp,
            issuedBy: msg.sender,
            isVerified: false,
            verifiedBy: address(0),
            verificationTimestamp: 0
        });
        
        productDocuments[_productId].push(documentId);
        
        emit DocumentAdded(documentId, _productId, _documentType);
        return documentId;
    }

    function verifyDocument(uint256 _documentId) public onlyVerifier {
        require(_documentId <= documentCount && _documentId > 0, "Invalid document ID");
        Document storage document = documents[_documentId];
        require(!document.isVerified, "Document is already verified");
        
        document.isVerified = true;
        document.verifiedBy = msg.sender;
        document.verificationTimestamp = block.timestamp;
        
        emit DocumentVerified(_documentId, msg.sender);
    }

    // View functions
    function getDocumentDetails(uint256 _documentId) public view returns (
        uint256 id,
        uint256 productId,
        string memory documentType,
        string memory documentHash,
        uint256 timestamp,
        address issuedBy,
        bool isVerified,
        address verifiedBy,
        uint256 verificationTimestamp
    ) {
        require(_documentId <= documentCount && _documentId > 0, "Invalid document ID");
        Document storage document = documents[_documentId];
        
        return (
            document.id,
            document.productId,
            document.documentType,
            document.documentHash,
            document.timestamp,
            document.issuedBy,
            document.isVerified,
            document.verifiedBy,
            document.verificationTimestamp
        );
    }

    function getProductDocuments(uint256 _productId) public view returns (uint256[] memory) {
        return productDocuments[_productId];
    }

    function isVerifier(address _address) public view returns (bool) {
        return verifiers[_address];
    }

    function getDocumentCount() public view returns (uint256) {
        return documentCount;
    }
} 