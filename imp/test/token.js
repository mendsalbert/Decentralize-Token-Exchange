const { expect } = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseEther(n.toString());
};
describe("Token", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let name = "Hyadum Coin";
  let decimal = 18;
  let symbol = "HYC";
  let totalSupply = tokens(1000000);

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy();
    await token.deployed();
  });

  it("Should have a name", async function () {
    expect(await token.name()).to.equal(name);
  });

  it("Should have a symbol", async function () {
    expect(await token.symbol()).to.equal(symbol);
  });

  it("Should have a decimal", async function () {
    expect(await token.decimals()).to.equal(decimal);
  });

  it("Should have a total supply", async function () {
    expect(await token.totalSupply()).to.equal(totalSupply);
  });

  it("Should assign totalSupply to deployer", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
  });

  describe("Transfer Tokens", () => {
    let result, amount;
    beforeEach(async function () {
      amount = tokens(100);
      result = await token.transferTo(addr1.address, tokens(100), {
        from: owner.address,
      });
    });

    describe("Successs", () => {
      it("Should Transfer token balance", async function () {
        expect(await token.balanceOf(owner.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(addr1.address)).to.equal(tokens(100));
      });
    });

    describe("Failure", async () => {
      it("Should reject insufficient balance", async function () {
        let invalidAmount;
        invalidAmount = tokens(100000000);

        const tx = token.transferTo(addr1.address, invalidAmount, {
          from: owner.address,
        });
        await expect(tx).to.revertedWith(
          "VM Exception while processing transaction: reverted with reason string 'VM Exception while processing transaction: revert"
        );
      });
    });
  });

  describe("approving tokens", () => {
    let result, amount;
    beforeEach(async function () {
      amount = tokens(100);
      result = await token.approve(addr2.address, tokens(100), {
        from: owner.address,
      });
    });

    describe("Successs", () => {
      it("allocate allowance for delegated token spending", async function () {
        expect(await token.allowance(owner.address, addr2.address)).to.equal(
          amount
        );
      });
    });
  });

  describe("Transfer tokens", () => {
    let result, amount;
    beforeEach(async function () {
      amount = tokens(100);
      await token.approve(addr2.address, tokens(100), {
        from: owner.address,
      });
    });

    describe("Successs", () => {
      beforeEach(async function () {
        result = await token.connect(addr2).transferFrom(
          owner.address,
          addr1.address,
          tokens(100)
          // {
          //   from: addr2.address,
          // }
        );
      });

      it("Should Transfer token balance", async function () {
        expect(await token.balanceOf(owner.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(addr1.address)).to.equal(tokens(100));
      });
    });
  });
});
