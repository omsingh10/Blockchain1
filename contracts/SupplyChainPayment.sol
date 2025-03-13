// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChainPayment {
    // Struct to store payment details
    struct Payment {
        uint256 id;
        uint256 productId;
        address payer;
        address payee;
        uint256 amount;
        uint256 timestamp;
        bool isCompleted;
        PaymentStatus status;
    }

    // Enum to track payment status
    enum PaymentStatus {
        Pending,
        Completed,
        Refunded,
        Disputed
    }

    // Struct to store escrow details
    struct Escrow {
        uint256 id;
        uint256 productId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 releaseTime; // Timestamp when funds can be released
        bool isReleased;
        bool isRefunded;
    }

    // Mappings
    mapping(uint256 => Payment) private payments;
    mapping(uint256 => Escrow) private escrows;
    mapping(uint256 => uint256[]) private productPayments;
    mapping(uint256 => uint256) private productEscrows;
    
    uint256 private paymentCount;
    uint256 private escrowCount;
    address private owner;
    uint256 private platformFeePercentage; // in basis points (1% = 100)

    // Events
    event PaymentCreated(uint256 indexed paymentId, uint256 indexed productId, address payer, address payee, uint256 amount);
    event PaymentCompleted(uint256 indexed paymentId);
    event PaymentRefunded(uint256 indexed paymentId);
    event PaymentDisputed(uint256 indexed paymentId, string reason);
    event EscrowCreated(uint256 indexed escrowId, uint256 indexed productId, address buyer, address seller, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);
    event PlatformFeeUpdated(uint256 newFeePercentage);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyPayer(uint256 _paymentId) {
        require(payments[_paymentId].payer == msg.sender, "Only payer can call this function");
        _;
    }

    modifier onlyPayee(uint256 _paymentId) {
        require(payments[_paymentId].payee == msg.sender, "Only payee can call this function");
        _;
    }

    modifier onlyBuyer(uint256 _escrowId) {
        require(escrows[_escrowId].buyer == msg.sender, "Only buyer can call this function");
        _;
    }

    modifier onlySeller(uint256 _escrowId) {
        require(escrows[_escrowId].seller == msg.sender, "Only seller can call this function");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        paymentCount = 0;
        escrowCount = 0;
        platformFeePercentage = 100; // 1% default fee
    }

    // Platform fee management
    function setPlatformFee(uint256 _feePercentage) public onlyOwner {
        require(_feePercentage <= 1000, "Fee percentage cannot exceed 10%");
        platformFeePercentage = _feePercentage;
        emit PlatformFeeUpdated(_feePercentage);
    }

    function getPlatformFee() public view returns (uint256) {
        return platformFeePercentage;
    }

    // Payment functions
    function createPayment(uint256 _productId, address _payee) public payable returns (uint256) {
        require(msg.value > 0, "Payment amount must be greater than 0");
        
        paymentCount++;
        uint256 paymentId = paymentCount;
        
        payments[paymentId] = Payment({
            id: paymentId,
            productId: _productId,
            payer: msg.sender,
            payee: _payee,
            amount: msg.value,
            timestamp: block.timestamp,
            isCompleted: false,
            status: PaymentStatus.Pending
        });
        
        productPayments[_productId].push(paymentId);
        
        emit PaymentCreated(paymentId, _productId, msg.sender, _payee, msg.value);
        return paymentId;
    }

    function completePayment(uint256 _paymentId) public onlyOwner {
        require(_paymentId <= paymentCount && _paymentId > 0, "Invalid payment ID");
        Payment storage payment = payments[_paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment is not in pending status");
        
        payment.status = PaymentStatus.Completed;
        payment.isCompleted = true;
        
        // Calculate platform fee
        uint256 fee = (payment.amount * platformFeePercentage) / 10000;
        uint256 payeeAmount = payment.amount - fee;
        
        // Transfer funds
        payable(payment.payee).transfer(payeeAmount);
        payable(owner).transfer(fee);
        
        emit PaymentCompleted(_paymentId);
    }

    function refundPayment(uint256 _paymentId) public onlyOwner {
        require(_paymentId <= paymentCount && _paymentId > 0, "Invalid payment ID");
        Payment storage payment = payments[_paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment is not in pending status");
        
        payment.status = PaymentStatus.Refunded;
        
        // Refund the full amount to payer
        payable(payment.payer).transfer(payment.amount);
        
        emit PaymentRefunded(_paymentId);
    }

    function disputePayment(uint256 _paymentId, string memory _reason) public onlyPayer(_paymentId) {
        require(_paymentId <= paymentCount && _paymentId > 0, "Invalid payment ID");
        Payment storage payment = payments[_paymentId];
        require(payment.status == PaymentStatus.Pending, "Payment is not in pending status");
        
        payment.status = PaymentStatus.Disputed;
        
        emit PaymentDisputed(_paymentId, _reason);
    }

    // Escrow functions
    function createEscrow(uint256 _productId, address _seller, uint256 _releaseTime) public payable returns (uint256) {
        require(msg.value > 0, "Escrow amount must be greater than 0");
        require(_releaseTime > block.timestamp, "Release time must be in the future");
        
        escrowCount++;
        uint256 escrowId = escrowCount;
        
        escrows[escrowId] = Escrow({
            id: escrowId,
            productId: _productId,
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            releaseTime: _releaseTime,
            isReleased: false,
            isRefunded: false
        });
        
        productEscrows[_productId] = escrowId;
        
        emit EscrowCreated(escrowId, _productId, msg.sender, _seller, msg.value);
        return escrowId;
    }

    function releaseEscrow(uint256 _escrowId) public {
        require(_escrowId <= escrowCount && _escrowId > 0, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        
        // Allow release if caller is the buyer or if release time has passed
        require(
            msg.sender == escrow.buyer || 
            block.timestamp >= escrow.releaseTime, 
            "Not authorized or release time not reached"
        );
        
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already released or refunded");
        
        escrow.isReleased = true;
        
        // Calculate platform fee
        uint256 fee = (escrow.amount * platformFeePercentage) / 10000;
        uint256 sellerAmount = escrow.amount - fee;
        
        // Transfer funds
        payable(escrow.seller).transfer(sellerAmount);
        payable(owner).transfer(fee);
        
        emit EscrowReleased(_escrowId);
    }

    function refundEscrow(uint256 _escrowId) public onlyOwner {
        require(_escrowId <= escrowCount && _escrowId > 0, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.isReleased && !escrow.isRefunded, "Escrow already released or refunded");
        
        escrow.isRefunded = true;
        
        // Refund the full amount to buyer
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit EscrowRefunded(_escrowId);
    }

    // View functions
    function getPaymentDetails(uint256 _paymentId) public view returns (
        uint256 id,
        uint256 productId,
        address payer,
        address payee,
        uint256 amount,
        uint256 timestamp,
        bool isCompleted,
        PaymentStatus status
    ) {
        require(_paymentId <= paymentCount && _paymentId > 0, "Invalid payment ID");
        Payment storage payment = payments[_paymentId];
        
        return (
            payment.id,
            payment.productId,
            payment.payer,
            payment.payee,
            payment.amount,
            payment.timestamp,
            payment.isCompleted,
            payment.status
        );
    }

    function getEscrowDetails(uint256 _escrowId) public view returns (
        uint256 id,
        uint256 productId,
        address buyer,
        address seller,
        uint256 amount,
        uint256 releaseTime,
        bool isReleased,
        bool isRefunded
    ) {
        require(_escrowId <= escrowCount && _escrowId > 0, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        
        return (
            escrow.id,
            escrow.productId,
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.releaseTime,
            escrow.isReleased,
            escrow.isRefunded
        );
    }

    function getProductPayments(uint256 _productId) public view returns (uint256[] memory) {
        return productPayments[_productId];
    }

    function getProductEscrow(uint256 _productId) public view returns (uint256) {
        return productEscrows[_productId];
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }
} 