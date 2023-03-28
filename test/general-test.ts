import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Re-entrancy attack", () => {
  let fundStoreContractFactory,
    fundStoreContract: any,
    attackerFactory,
    attackerContract: any;
  beforeEach(async () => {
    // fundStore contract
    fundStoreContractFactory = await ethers.getContractFactory("FundStore");
    fundStoreContract = await fundStoreContractFactory.deploy();

    // attacker contract
    attackerFactory = await ethers.getContractFactory(
      "SimpleReentrancyAttacker"
    );
    attackerContract = await attackerFactory.deploy();

    const [owner] = await ethers.getSigners();

    const txn = await fundStoreContract.deposit({
      value: ethers.utils.parseEther("4"),
    });
  });

  it("FundStore contract should have atleast 4 Eth", async () => {
    let fundAmount = await fundStoreContract.getBalance();
    console.log(ethers.utils.formatEther(fundAmount));
    expect(Number(ethers.utils.formatEther(fundAmount))).equal(4);
  });

  it("should drain fund store contract to zero balance", async () => {
    let txn1 = await attackerContract.attack(fundStoreContract.address, {
      value: ethers.utils.parseEther("1"),
    });

    let fundAmount = await fundStoreContract.getBalance();
    console.log(fundAmount)
    expect(Number(ethers.utils.formatEther(fundAmount))).equal(0);
  });
});
