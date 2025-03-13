const SupplyChain = artifacts.require("SupplyChain");
const DocumentVerification = artifacts.require("DocumentVerification");
const SupplyChainPayment = artifacts.require("SupplyChainPayment");

module.exports = async function(deployer, network, accounts) {
  // Deploy SupplyChain contract
  await deployer.deploy(SupplyChain);
  const supplyChainInstance = await SupplyChain.deployed();
  console.log("SupplyChain contract deployed at:", supplyChainInstance.address);

  // Deploy DocumentVerification contract
  await deployer.deploy(DocumentVerification);
  const documentVerificationInstance = await DocumentVerification.deployed();
  console.log("DocumentVerification contract deployed at:", documentVerificationInstance.address);

  // Deploy SupplyChainPayment contract
  await deployer.deploy(SupplyChainPayment);
  const supplyChainPaymentInstance = await SupplyChainPayment.deployed();
  console.log("SupplyChainPayment contract deployed at:", supplyChainPaymentInstance.address);

  // Log deployment addresses for easy reference
  console.log("\nDeployment Summary:");
  console.log("====================");
  console.log("SupplyChain:", supplyChainInstance.address);
  console.log("DocumentVerification:", documentVerificationInstance.address);
  console.log("SupplyChainPayment:", supplyChainPaymentInstance.address);
  console.log("\nUpdate these addresses in your .env file");
}; 