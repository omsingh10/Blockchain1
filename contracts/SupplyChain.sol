// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    // Enum to track the status of a product
    enum ProductStatus { 
        Created,
        InTransit,
        Delivered,
        Rejected
    }

    // Struct to store product details
    struct Product {
        uint256 id;
        string name;
        string description;
        address manufacturer;
        uint256 manufactureDate;
        uint256 price;
        ProductStatus status;
        mapping(uint256 => ShipmentUpdate) shipmentUpdates;
        uint256 updateCount;
    }

    // Struct to store shipment updates
    struct ShipmentUpdate {
        uint256 timestamp;
        string location;
        string notes;
        address updatedBy;
        ProductStatus status;
    }

    // Struct to store user details
    struct User {
        address userAddress;
        string name;
        string role; // Manufacturer, Distributor, Retailer, Customer
        bool isActive;
    }

    // Mappings
    mapping(uint256 => Product) private products;
    mapping(address => User) private users;
    mapping(address => bool) private admins;
    
    uint256 private productCount;
    address private owner;

    // Events
    event ProductCreated(uint256 indexed productId, string name, address manufacturer);
    event ProductUpdated(uint256 indexed productId, ProductStatus status, string location);
    event UserAdded(address indexed userAddress, string name, string role);
    event AdminAdded(address indexed adminAddress);
    event AdminRemoved(address indexed adminAddress);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].isActive, "User is not registered or active");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
        productCount = 0;
    }

    // Admin functions
    function addAdmin(address _admin) public onlyOwner {
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        require(_admin != owner, "Cannot remove owner as admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // User management
    function registerUser(address _userAddress, string memory _name, string memory _role) public onlyAdmin {
        users[_userAddress] = User({
            userAddress: _userAddress,
            name: _name,
            role: _role,
            isActive: true
        });
        emit UserAdded(_userAddress, _name, _role);
    }

    function deactivateUser(address _userAddress) public onlyAdmin {
        require(users[_userAddress].isActive, "User is already inactive");
        users[_userAddress].isActive = false;
    }

    function activateUser(address _userAddress) public onlyAdmin {
        require(!users[_userAddress].isActive, "User is already active");
        users[_userAddress].isActive = true;
    }

    // Product management
    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public onlyRegisteredUser returns (uint256) {
        productCount++;
        uint256 productId = productCount;
        
        Product storage newProduct = products[productId];
        newProduct.id = productId;
        newProduct.name = _name;
        newProduct.description = _description;
        newProduct.manufacturer = msg.sender;
        newProduct.manufactureDate = block.timestamp;
        newProduct.price = _price;
        newProduct.status = ProductStatus.Created;
        newProduct.updateCount = 0;
        
        // Add initial shipment update
        addShipmentUpdate(
            productId, 
            "Manufacturing Facility", 
            "Product created", 
            ProductStatus.Created
        );
        
        emit ProductCreated(productId, _name, msg.sender);
        return productId;
    }

    function addShipmentUpdate(
        uint256 _productId,
        string memory _location,
        string memory _notes,
        ProductStatus _status
    ) public onlyRegisteredUser {
        require(_productId <= productCount && _productId > 0, "Invalid product ID");
        
        Product storage product = products[_productId];
        uint256 updateId = product.updateCount + 1;
        
        ShipmentUpdate storage update = product.shipmentUpdates[updateId];
        update.timestamp = block.timestamp;
        update.location = _location;
        update.notes = _notes;
        update.updatedBy = msg.sender;
        update.status = _status;
        
        product.updateCount = updateId;
        product.status = _status;
        
        emit ProductUpdated(_productId, _status, _location);
    }

    // View functions
    function getProductDetails(uint256 _productId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        address manufacturer,
        uint256 manufactureDate,
        uint256 price,
        ProductStatus status,
        uint256 updateCount
    ) {
        require(_productId <= productCount && _productId > 0, "Invalid product ID");
        Product storage product = products[_productId];
        
        return (
            product.id,
            product.name,
            product.description,
            product.manufacturer,
            product.manufactureDate,
            product.price,
            product.status,
            product.updateCount
        );
    }

    function getShipmentUpdate(uint256 _productId, uint256 _updateId) public view returns (
        uint256 timestamp,
        string memory location,
        string memory notes,
        address updatedBy,
        ProductStatus status
    ) {
        require(_productId <= productCount && _productId > 0, "Invalid product ID");
        Product storage product = products[_productId];
        require(_updateId <= product.updateCount && _updateId > 0, "Invalid update ID");
        
        ShipmentUpdate storage update = product.shipmentUpdates[_updateId];
        
        return (
            update.timestamp,
            update.location,
            update.notes,
            update.updatedBy,
            update.status
        );
    }

    function getUserDetails(address _userAddress) public view returns (
        string memory name,
        string memory role,
        bool isActive
    ) {
        User storage user = users[_userAddress];
        return (
            user.name,
            user.role,
            user.isActive
        );
    }

    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }
} 