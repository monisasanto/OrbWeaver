const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QueryRouter", function () {
  let queryRouter;
  let schemaRegistry;
  let adapterRegistry;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
    schemaRegistry = await SchemaRegistry.deploy(owner.address);
    await schemaRegistry.waitForDeployment();

    const AdapterRegistry = await ethers.getContractFactory("AdapterRegistry");
    adapterRegistry = await AdapterRegistry.deploy(owner.address);
    await adapterRegistry.waitForDeployment();

    const QueryRouter = await ethers.getContractFactory("QueryRouter");
    queryRouter = await QueryRouter.deploy(
      await schemaRegistry.getAddress(),
      await adapterRegistry.getAddress(),
      owner.address
    );
    await queryRouter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct registry addresses", async function () {
      expect(await queryRouter.schemaRegistry()).to.equal(
        await schemaRegistry.getAddress()
      );
      expect(await queryRouter.adapterRegistry()).to.equal(
        await adapterRegistry.getAddress()
      );
    });

    it("Should set correct governance", async function () {
      expect(await queryRouter.governance()).to.equal(owner.address);
    });

    it("Should have default base cost", async function () {
      expect(await queryRouter.baseCostPerChain()).to.equal(
        ethers.parseEther("0.001")
      );
    });
  });

  describe("Query Planning", function () {
    let schemaId;

    beforeEach(async function () {
      const fields = [
        { name: "amount", fieldType: "uint256", required: true }
      ];

      const tx = await schemaRegistry.registerSchema("Position", fields);
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        log => log.fragment && log.fragment.name === "SchemaRegistered"
      );
      schemaId = event.args[0];

      await adapterRegistry.registerAdapter(1, addr1.address, "Ethereum");
    });

    it("Should estimate query cost", async function () {
      const cost = await queryRouter.estimateQueryCost(schemaId, [1]);

      expect(cost).to.equal(ethers.parseEther("0.001"));
    });

    it("Should estimate cost for multiple chains", async function () {
      await adapterRegistry.registerAdapter(137, addr1.address, "Polygon");

      const cost = await queryRouter.estimateQueryCost(schemaId, [1, 137]);

      expect(cost).to.equal(ethers.parseEther("0.002"));
    });

    it("Should fail with empty chain list", async function () {
      await expect(
        queryRouter.estimateQueryCost(schemaId, [])
      ).to.be.revertedWith("QueryRouter: no chains specified");
    });
  });

  describe("Configuration", function () {
    it("Should update base cost", async function () {
      await queryRouter.updateBaseCost(ethers.parseEther("0.002"));

      expect(await queryRouter.baseCostPerChain()).to.equal(
        ethers.parseEther("0.002")
      );
    });

    it("Should require governance to update base cost", async function () {
      await expect(
        queryRouter.connect(addr1).updateBaseCost(ethers.parseEther("0.002"))
      ).to.be.revertedWith("QueryRouter: not governance");
    });
  });
});

