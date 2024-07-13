import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("OrangeToken", function () {
  const tokenName = "Orange";
  const tokenSymbol = "ORG";
  const tokenDecimals = 8;
  const tokenTotalSupply = 10_000_000;

  async function deployOrangeTokenFixture() {
    const OrangeToken = await hre.ethers.getContractFactory("OrangeToken");
    const [contractOwner, otherAccount] = await hre.ethers.getSigners();
    const orangeToken = await OrangeToken.deploy(
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenTotalSupply
    );
    await orangeToken.waitForDeployment();

    return { orangeToken, contractOwner, otherAccount };
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

  describe("#totalSupply()", function () {
    it("returns the total supply of tokens", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      const totalSupply = await orangeToken.totalSupply();

      expect(totalSupply).to.equal(tokenTotalSupply);
    });
  });

  describe("#balanceOf()", function () {
    it("returns the account balance of another account with address", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      // setup
      const aWallet = hre.ethers.Wallet.createRandom();
      const anAddress = aWallet.address;
      const value = 100;
      await orangeToken.transfer(anAddress, value);

      // fire
      const balanceOfAnotherAddress = await orangeToken.balanceOf(anAddress);

      expect(balanceOfAnotherAddress).to.equal(value);
    });
  });

  describe("#transfer()", function () {
    it("transfers _value amount of tokens to address _to", async function () {
      const { orangeToken } = await loadFixture(deployOrangeTokenFixture);

      // setup
      const aWallet = hre.ethers.Wallet.createRandom();
      const anAddress = aWallet.address;
      const value = 100;

      // fire
      const transferResult = await orangeToken.transfer(anAddress, value);

      // test
      const balance = await orangeToken.balanceOf(anAddress);
      expect(balance).to.equal(value);
    });

    it("emits the Transfer event", async function () {
      const { orangeToken, contractOwner } = await loadFixture(
        deployOrangeTokenFixture
      );

      // setup
      const aWallet = hre.ethers.Wallet.createRandom();
      const anAddress = aWallet.address;
      const value = 100;

      // fire
      await expect(orangeToken.transfer(anAddress, value))
        .to.emit(orangeToken, "Transfer")
        .withArgs(contractOwner, anAddress, value);
    });

    it("reverts when caller’s account balance does not have enough tokens to spend", async function () {
      const { orangeToken, otherAccount } = await loadFixture(
        deployOrangeTokenFixture
      );

      // setup
      const aWallet = hre.ethers.Wallet.createRandom();
      const anAddress = aWallet.address;
      const value = 100;

      // fire
      await expect(
        orangeToken.connect(otherAccount).transfer(anAddress, value)
      ).to.be.revertedWith("caller does not have enough tokens to transfer");
    });

    context("when transfer value is 0", function () {
      it("treats as normal transfer and fires the Transfer event", async function () {
        const { orangeToken, contractOwner } = await loadFixture(
          deployOrangeTokenFixture
        );

        // setup
        const aWallet = hre.ethers.Wallet.createRandom();
        const anAddress = aWallet.address;
        const value = 0;

        // fire
        await expect(orangeToken.transfer(anAddress, value))
          .to.emit(orangeToken, "Transfer")
          .withArgs(contractOwner, anAddress, value);

        // test
        const balance = await orangeToken.balanceOf(anAddress);
        expect(balance).to.equal(value);
      });
    });
  });

  describe("#transferFrom()", function () {
    it("transfers _value amount of tokens from address _from to address _to", async function () {
      const {
        orangeToken,
        contractOwner,
        otherAccount: fromAccount,
      } = await loadFixture(deployOrangeTokenFixture);

      // setup
      const fromAddress = fromAccount.address;

      const toWallet = hre.ethers.Wallet.createRandom();
      const toAddress = toWallet.address;

      const value = 100;

      const fromAddressBalanceBefore = 1_000;
      await orangeToken.transfer(fromAddress, fromAddressBalanceBefore);

      const toAddressBalanceBefore = 2_000;
      await orangeToken.transfer(toAddress, toAddressBalanceBefore);

      await orangeToken.connect(fromAccount).approve(contractOwner, value);

      // fire
      await orangeToken.transferFrom(fromAddress, toAddress, value);

      const fromAddressBalanceAfter = await orangeToken.balanceOf(fromAddress);
      expect(fromAddressBalanceAfter).to.equal(
        fromAddressBalanceBefore - value
      );

      const toAddressBalanceAfter = await orangeToken.balanceOf(toAddress);
      expect(toAddressBalanceAfter).to.equal(toAddressBalanceBefore + value);
    });

    it("fires the Transfer event", async function () {
      const {
        orangeToken,
        contractOwner,
        otherAccount: fromAccount,
      } = await loadFixture(deployOrangeTokenFixture);

      // setup
      const fromAddress = fromAccount.address;

      const toWallet = hre.ethers.Wallet.createRandom();
      const toAddress = toWallet.address;

      const value = 100;

      const fromAddressBalanceBefore = 1_000;
      await orangeToken.transfer(fromAddress, fromAddressBalanceBefore);

      const toAddressBalanceBefore = 2_000;
      await orangeToken.transfer(toAddress, toAddressBalanceBefore);

      await orangeToken.connect(fromAccount).approve(contractOwner, value);

      // fire
      await expect(orangeToken.transferFrom(fromAddress, toAddress, value))
        .to.emit(orangeToken, "Transfer")
        .withArgs(fromAddress, toAddress, value);
    });

    context("when _from address does not have enough balance", function () {
      it("reverts", async function () {
        const {
          orangeToken,
          contractOwner,
          otherAccount: fromAccount,
        } = await loadFixture(deployOrangeTokenFixture);

        // setup
        const fromAddress = fromAccount.address;

        const toWallet = hre.ethers.Wallet.createRandom();
        const toAddress = toWallet.address;

        const value = 100;

        const fromAddressBalanceBefore = value - 1;
        await orangeToken.transfer(fromAddress, fromAddressBalanceBefore);

        const toAddressBalanceBefore = 2_000;
        await orangeToken.transfer(toAddress, toAddressBalanceBefore);

        await orangeToken.connect(fromAccount).approve(contractOwner, value);

        // fire
        await expect(
          orangeToken.transferFrom(fromAddress, toAddress, value)
        ).to.revertedWith("not enough balance to transfer");
      });
    });

    context(
      "when sender does not have allowance from _from to execute the transfer",
      function () {
        context("when allowance is positive but less than value", function () {
          it("reverts", async function () {
            const {
              orangeToken,
              contractOwner,
              otherAccount: fromAccount,
            } = await loadFixture(deployOrangeTokenFixture);

            // setup
            const fromAddress = fromAccount.address;

            const toWallet = hre.ethers.Wallet.createRandom();
            const toAddress = toWallet.address;

            const value = 100;

            const fromAddressBalanceBefore = 1_000;
            await orangeToken.transfer(fromAddress, fromAddressBalanceBefore);

            const toAddressBalanceBefore = 2_000;
            await orangeToken.transfer(toAddress, toAddressBalanceBefore);

            await orangeToken
              .connect(fromAccount)
              .approve(contractOwner, value - 1);

            // fire
            await expect(
              orangeToken.transferFrom(fromAddress, toAddress, value)
            ).to.revertedWith(
              "sender is not allowed to transfer this amount on behalf of _from"
            );
          });
        });

        context("when allowance is 0", function () {
          it("reverts", async function () {
            const {
              orangeToken,
              contractOwner,
              otherAccount: fromAccount,
            } = await loadFixture(deployOrangeTokenFixture);

            // setup
            const fromAddress = fromAccount.address;

            const toWallet = hre.ethers.Wallet.createRandom();
            const toAddress = toWallet.address;

            const value = 100;

            const fromAddressBalanceBefore = 1_000;
            await orangeToken.transfer(fromAddress, fromAddressBalanceBefore);

            const toAddressBalanceBefore = 2_000;
            await orangeToken.transfer(toAddress, toAddressBalanceBefore);

            await orangeToken.connect(fromAccount).approve(contractOwner, 0);

            // fire
            await expect(
              orangeToken.transferFrom(fromAddress, toAddress, value)
            ).to.revertedWith(
              "sender is not allowed to transfer this amount on behalf of _from"
            );
          });
        });
      }
    );
  });
});
