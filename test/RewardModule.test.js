const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardModule", function () {
  let rewardModule;
  let owner;
  let indexer1;
  let indexer2;

  beforeEach(async function () {
    [owner, indexer1, indexer2] = await ethers.getSigners();

    const RewardModule = await ethers.getContractFactory("RewardModule");
    rewardModule = await RewardModule.deploy(owner.address);
    await rewardModule.waitForDeployment();

    // Fund the reward module
    await owner.sendTransaction({
      to: await rewardModule.getAddress(),
      value: ethers.parseEther("10")
    });
  });

  describe("Deployment", function () {
    it("Should set the correct governance address", async function () {
      expect(await rewardModule.governance()).to.equal(owner.address);
    });

    it("Should have correct minimum stake", async function () {
      expect(await rewardModule.minimumStake()).to.equal(
        ethers.parseEther("1")
      );
    });
  });

  describe("Indexer Registration", function () {
    it("Should register an indexer with stake", async function () {
      const stake = ethers.parseEther("1");

      await rewardModule.connect(indexer1).registerIndexer(stake, {
        value: stake
      });

      const metrics = await rewardModule.getIndexerMetrics(indexer1.address);
      expect(metrics.accuracy).to.equal(100);
      expect(metrics.queriesServed).to.equal(0);
    });

    it("Should fail with insufficient stake", async function () {
      const stake = ethers.parseEther("0.5");

      await expect(
        rewardModule.connect(indexer1).registerIndexer(stake, {
          value: stake
        })
      ).to.be.revertedWith("RewardModule: insufficient stake");
    });

    it("Should fail if already registered", async function () {
      const stake = ethers.parseEther("1");

      await rewardModule.connect(indexer1).registerIndexer(stake, {
        value: stake
      });

      await expect(
        rewardModule.connect(indexer1).registerIndexer(stake, {
          value: stake
        })
      ).to.be.revertedWith("RewardModule: already registered");
    });
  });

  describe("Reward Distribution", function () {
    beforeEach(async function () {
      const stake = ethers.parseEther("1");
      await rewardModule.connect(indexer1).registerIndexer(stake, {
        value: stake
      });
    });

    it("Should distribute rewards to indexer", async function () {
      const queryId = ethers.id("query1");
      const reward = ethers.parseEther("0.1");

      const balanceBefore = await ethers.provider.getBalance(indexer1.address);

      await rewardModule.distributeReward(
        indexer1.address,
        reward,
        queryId
      );

      const balanceAfter = await ethers.provider.getBalance(indexer1.address);
      expect(balanceAfter - balanceBefore).to.equal(reward);

      const metrics = await rewardModule.getIndexerMetrics(indexer1.address);
      expect(metrics.totalRewards).to.equal(reward);
      expect(metrics.queriesServed).to.equal(1);
    });

    it("Should require governance to distribute", async function () {
      const queryId = ethers.id("query1");
      const reward = ethers.parseEther("0.1");

      await expect(
        rewardModule.connect(indexer1).distributeReward(
          indexer1.address,
          reward,
          queryId
        )
      ).to.be.revertedWith("RewardModule: not governance");
    });
  });

  describe("Indexer Slashing", function () {
    beforeEach(async function () {
      const stake = ethers.parseEther("2");
      await rewardModule.connect(indexer1).registerIndexer(stake, {
        value: stake
      });
    });

    it("Should slash indexer stake", async function () {
      const slashAmount = ethers.parseEther("0.5");

      await rewardModule.slashIndexer(
        indexer1.address,
        slashAmount,
        "Poor performance"
      );
    });

    it("Should fail with insufficient stake", async function () {
      const slashAmount = ethers.parseEther("3");

      await expect(
        rewardModule.slashIndexer(
          indexer1.address,
          slashAmount,
          "Poor performance"
        )
      ).to.be.revertedWith("RewardModule: insufficient stake");
    });
  });

  describe("Reward Calculation", function () {
    beforeEach(async function () {
      const stake = ethers.parseEther("1");
      await rewardModule.connect(indexer1).registerIndexer(stake, {
        value: stake
      });
    });

    it("Should calculate reward based on complexity", async function () {
      const complexity = 100;

      const reward = await rewardModule.calculateReward(
        indexer1.address,
        complexity
      );

      expect(reward).to.be.gt(0);
    });

    it("Should include accuracy bonus", async function () {
      await rewardModule.updateMetrics(indexer1.address, 100, 95, 1000);

      const reward = await rewardModule.calculateReward(
        indexer1.address,
        100
      );

      expect(reward).to.be.gt(0);
    });
  });
});

