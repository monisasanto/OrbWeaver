const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // Deploy SchemaRegistry
  const SchemaRegistry = await hre.ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = await SchemaRegistry.deploy(deployer.address);
  await schemaRegistry.waitForDeployment();
  console.log("SchemaRegistry deployed to:", await schemaRegistry.getAddress());

  // Deploy AdapterRegistry
  const AdapterRegistry = await hre.ethers.getContractFactory("AdapterRegistry");
  const adapterRegistry = await AdapterRegistry.deploy(deployer.address);
  await adapterRegistry.waitForDeployment();
  console.log("AdapterRegistry deployed to:", await adapterRegistry.getAddress());

  // Deploy QueryRouter
  const QueryRouter = await hre.ethers.getContractFactory("QueryRouter");
  const queryRouter = await QueryRouter.deploy(
    await schemaRegistry.getAddress(),
    await adapterRegistry.getAddress(),
    deployer.address
  );
  await queryRouter.waitForDeployment();
  console.log("QueryRouter deployed to:", await queryRouter.getAddress());

  // Deploy RewardModule
  const RewardModule = await hre.ethers.getContractFactory("RewardModule");
  const rewardModule = await RewardModule.deploy(deployer.address);
  await rewardModule.waitForDeployment();
  console.log("RewardModule deployed to:", await rewardModule.getAddress());

  // Deploy zkIndexVerifier
  const ZkIndexVerifier = await hre.ethers.getContractFactory("zkIndexVerifier");
  const zkVerifier = await ZkIndexVerifier.deploy(deployer.address);
  await zkVerifier.waitForDeployment();
  console.log("zkIndexVerifier deployed to:", await zkVerifier.getAddress());

  console.log("\nDeployment complete!");
  console.log("Save these addresses for future use:");
  console.log({
    SchemaRegistry: await schemaRegistry.getAddress(),
    AdapterRegistry: await adapterRegistry.getAddress(),
    QueryRouter: await queryRouter.getAddress(),
    RewardModule: await rewardModule.getAddress(),
    zkIndexVerifier: await zkVerifier.getAddress()
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

