const {ethers,getNamedAccounts, network}=require("hardhat")
const {assert}=require("chai");
const{developmentNames}=require("../../helper-hardhatConfig");

const sendEthers=ethers.utils.parseEther("0.1");
developmentNames.includes(network.name) ? describe.skip
: describe("FundMe",async function(){
    let fundMe;
    beforeEach(async function(){
        const {deployer}= (await getNamedAccounts()).deployer
        fundMe=await ethers.getContract("FundMe",deployer);
    })
it("Funding and Withdrawing works",async function(){
const fundTxResponse = await fundMe.fund({ value: sendValue })
await fundTxResponse.wait(1)

const withdrawTxResponse = await fundMe.withdraw()
await withdrawTxResponse.wait(1)

const endingFundMeBalance = await fundMe.provider.getBalance(
    fundMe.address
)
assert.equal(endingFundMeBalance.toString(),"0");
})
})