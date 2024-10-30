const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SchemaRegistry", function () {
  let schemaRegistry;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
    schemaRegistry = await SchemaRegistry.deploy(owner.address);
    await schemaRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct governance address", async function () {
      expect(await schemaRegistry.governance()).to.equal(owner.address);
    });

    it("Should start with zero schemas", async function () {
      expect(await schemaRegistry.schemaCount()).to.equal(0);
    });
  });

  describe("Schema Registration", function () {
    it("Should register a new schema", async function () {
      const fields = [
        { name: "amount", fieldType: "uint256", required: true },
        { name: "token", fieldType: "address", required: true }
      ];

      const tx = await schemaRegistry.registerSchema("Position", fields);
      const receipt = await tx.wait();

      expect(await schemaRegistry.schemaCount()).to.equal(1);
    });

    it("Should fail with empty entity type", async function () {
      const fields = [
        { name: "amount", fieldType: "uint256", required: true }
      ];

      await expect(
        schemaRegistry.registerSchema("", fields)
      ).to.be.revertedWith("SchemaRegistry: empty entity type");
    });

    it("Should fail with no fields", async function () {
      await expect(
        schemaRegistry.registerSchema("Position", [])
      ).to.be.revertedWith("SchemaRegistry: no fields provided");
    });
  });

  describe("Schema Updates", function () {
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
    });

    it("Should update schema version", async function () {
      const newFields = [
        { name: "amount", fieldType: "uint256", required: true },
        { name: "timestamp", fieldType: "uint256", required: false }
      ];

      await schemaRegistry.updateSchemaVersion(schemaId, newFields);

      const version = await schemaRegistry.getSchemaVersion(schemaId);
      expect(version).to.equal(2);
    });

    it("Should allow only creator or governance to update", async function () {
      const newFields = [
        { name: "amount", fieldType: "uint256", required: true }
      ];

      await expect(
        schemaRegistry.connect(addr1).updateSchemaVersion(schemaId, newFields)
      ).to.be.revertedWith("SchemaRegistry: not authorized");
    });
  });

  describe("Schema Deactivation", function () {
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
    });

    it("Should deactivate a schema", async function () {
      await schemaRegistry.deactivateSchema(schemaId);

      const isActive = await schemaRegistry.isSchemaActive(schemaId);
      expect(isActive).to.be.false;
    });

    it("Should allow only creator or governance to deactivate", async function () {
      await expect(
        schemaRegistry.connect(addr1).deactivateSchema(schemaId)
      ).to.be.revertedWith("SchemaRegistry: not authorized");
    });
  });
});

