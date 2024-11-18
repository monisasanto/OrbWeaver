const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdapterRegistry", function () {
  let adapterRegistry;
  let owner;
  let addr1;
  let adapter;

  beforeEach(async function () {
    [owner, addr1, adapter] = await ethers.getSigners();

    const AdapterRegistry = await ethers.getContractFactory("AdapterRegistry");
    adapterRegistry = await AdapterRegistry.deploy(owner.address);
    await adapterRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct governance address", async function () {
      expect(await adapterRegistry.governance()).to.equal(owner.address);
    });
  });

  describe("Adapter Registration", function () {
    it("Should register a new adapter", async function () {
      await adapterRegistry.registerAdapter(
        1,
        adapter.address,
        "Ethereum"
      );

      const adapterAddress = await adapterRegistry.getAdapter(1);
      expect(adapterAddress).to.equal(adapter.address);
    });

    it("Should fail with zero chain ID", async function () {
      await expect(
        adapterRegistry.registerAdapter(0, adapter.address, "Test")
      ).to.be.revertedWith("AdapterRegistry: invalid chain ID");
    });

    it("Should fail with zero address", async function () {
      await expect(
        adapterRegistry.registerAdapter(1, ethers.ZeroAddress, "Test")
      ).to.be.revertedWith("AdapterRegistry: zero address");
    });

    it("Should fail if adapter already exists", async function () {
      await adapterRegistry.registerAdapter(1, adapter.address, "Ethereum");

      await expect(
        adapterRegistry.registerAdapter(1, addr1.address, "Ethereum")
      ).to.be.revertedWith("AdapterRegistry: adapter already exists");
    });

    it("Should require governance to register", async function () {
      await expect(
        adapterRegistry.connect(addr1).registerAdapter(1, adapter.address, "Test")
      ).to.be.revertedWith("AdapterRegistry: not governance");
    });
  });

  describe("Adapter Updates", function () {
    beforeEach(async function () {
      await adapterRegistry.registerAdapter(1, adapter.address, "Ethereum");
    });

    it("Should update an existing adapter", async function () {
      await adapterRegistry.updateAdapter(1, addr1.address);

      const adapterAddress = await adapterRegistry.getAdapter(1);
      expect(adapterAddress).to.equal(addr1.address);
    });

    it("Should fail to update non-existent adapter", async function () {
      await expect(
        adapterRegistry.updateAdapter(999, addr1.address)
      ).to.be.revertedWith("AdapterRegistry: adapter not found");
    });

    it("Should require governance to update", async function () {
      await expect(
        adapterRegistry.connect(addr1).updateAdapter(1, addr1.address)
      ).to.be.revertedWith("AdapterRegistry: not governance");
    });
  });

  describe("Adapter Deactivation", function () {
    beforeEach(async function () {
      await adapterRegistry.registerAdapter(1, adapter.address, "Ethereum");
    });

    it("Should deactivate an adapter", async function () {
      await adapterRegistry.deactivateAdapter(1);

      const isActive = await adapterRegistry.isAdapterActive(1);
      expect(isActive).to.be.false;
    });

    it("Should fail to get deactivated adapter", async function () {
      await adapterRegistry.deactivateAdapter(1);

      await expect(
        adapterRegistry.getAdapter(1)
      ).to.be.revertedWith("AdapterRegistry: adapter not active");
    });
  });

  describe("Adapter Info", function () {
    beforeEach(async function () {
      await adapterRegistry.registerAdapter(1, adapter.address, "Ethereum");
    });

    it("Should return correct adapter info", async function () {
      const info = await adapterRegistry.getAdapterInfo(1);

      expect(info.adapterContract).to.equal(adapter.address);
      expect(info.chainName).to.equal("Ethereum");
      expect(info.chainId).to.equal(1);
      expect(info.active).to.be.true;
    });
  });
});

