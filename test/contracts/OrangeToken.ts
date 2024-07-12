import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("OrangeToken", function () {
  const tokenName = "Orange";
  const tokenSymbol = "ORG";
  const tokenDecimals = 8;

  async function deployOrangeTokenFixture() {
    const OrangeToken = await hre.ethers.getContractFactory("OrangeToken");
    const orangeToken = await OrangeToken.deploy(
      tokenName,
      tokenSymbol,
      tokenDecimals
    );

    return { orangeToken };
  }

  describe("#name()", function () {
    it("returns the name of the token", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      const name = await orangeToken.name();

      expect(name).to.equal(tokenName);
    });
  });

  describe("#symbol()", function () {
    it("returns the symbol of the token", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      const symbol = await orangeToken.symbol();

      expect(symbol).to.equal(tokenSymbol);
    });
  });

  describe("#decimals()", function () {
    it("returns the number of decimals", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      const decimals = await orangeToken.decimals();

      expect(decimals).to.equal(tokenDecimals);
    });
  });
});
