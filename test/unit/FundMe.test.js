
const {deployments,ethers,getNamedAccounts, network}=require("hardhat");
const {assert,expect}=require("chai");
const {developmentNames}=require("../../helper-hardhatConfig")
!developmentNames.includes(network.name)? describe.skip
: describe("FundMe",async ()=>{
    let fundMe;
    let deployer;
    let MockV3Aggregator;
    let sendEth=ethers.utils.parseEther("1");

  beforeEach(async ()=>{
   deployer=(await getNamedAccounts()).deployer;

 await deployments.fixture(["all"]);
fundMe=await ethers.getContract("FundMe",deployer);
MockV3Aggregator=await ethers.getContract("MockV3Aggregator",deployer);
// priceConverter=await ethers.getContract("PriceConverter");
  })
  describe("constructor",()=>{
    it("s_priceFeed Address Got Mock test Address",async ()=>{
const response= await fundMe.s_priceFeed();
assert.equal(response,MockV3Aggregator.address);
    })
    describe("fund",async function (){

        it("Fails, If there is not enough Eth",async function(){
await expect(fundMe.fund()).to.be.reverted
 })

 it("Updates the value of fund we sent",async function(){
    await fundMe.fund({value:sendEth})
const response =await fundMe.s_addressToAmountFunded(deployer);
assert.equal(response.toString(),sendEth.toString());
 })

 it("s_funders Stores the addresses of the senders", async function (){
await fundMe.fund({value:sendEth})
const response = await fundMe.s_funders(0)
assert.equal(response.toString(),deployer);
 })
})


describe("withdraw",async function (){
beforeEach(async function(){
  await fundMe.fund({value:sendEth});
})
it("Withdraws Eth - Single Funder",async function (){
const startingFundBalance= await fundMe.provider.getBalance(fundMe.address);
const startingDeployerBalance=await fundMe.provider.getBalance(deployer);

const transactionResponse= await fundMe.withdraw();
const transactionReceipt=await transactionResponse.wait(1);
const {gasUsed,effectiveGasPrice}=transactionReceipt;
const gasCost=gasUsed.mul(effectiveGasPrice);
const endingFundmeBalance= await fundMe.provider.getBalance(fundMe.address);
const endingDeployerBalance= await fundMe.provider.getBalance(deployer);
 
assert.equal(endingFundmeBalance.toString(),"0");
assert.equal(startingFundBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());

})

it("Withdraws Eth - Multiple s_funders", async function(){
  //arrange

  const accounts=await ethers.getSigners();
  for(let i=1;i<8;i++){
 const s_fundersConnectedContract=await fundMe.connect(accounts[i]);
 await s_fundersConnectedContract.fund({value:sendEth});
  }

  expect(await fundMe.s_funders(0)).to.be.reverted;

  const startingFundBalance= await fundMe.provider.getBalance(fundMe.address);
  const startingDeployerBalance=await fundMe.provider.getBalance(deployer);

//act
  const transactionResponse= await fundMe.withdraw();
  const transactionReceipt=await transactionResponse.wait(1);

 
  const {gasUsed,effectiveGasPrice}=transactionReceipt;
  const gasCost=gasUsed.mul(effectiveGasPrice);
  const endingFundmeBalance= await fundMe.provider.getBalance(fundMe.address);
  const endingDeployerBalance= await fundMe.provider.getBalance(deployer);

//assert
assert.equal(endingFundmeBalance.toString(),"0");
assert.equal(startingFundBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());

  for(let i=1;i<8;i++){
assert.equal(await fundMe.s_addressToAmountFunded(accounts[i].address),0);
  }
})

it("Only allows owner to withdraw fund", async function(){
  const accounts=await ethers.getSigners()
  const attacker=accounts[1];
  const connectAttackerContract=fundMe.connect(attacker);
  await expect(connectAttackerContract.withdraw()).to.be.reverted
})
})



describe("cheaperWithdraw",async function (){
  beforeEach(async function(){
    await fundMe.fund({value:sendEth});
  })
  it("Withdraws Eth - Single Funder",async function (){
  const startingFundBalance= await fundMe.provider.getBalance(fundMe.address);
  const startingDeployerBalance=await fundMe.provider.getBalance(deployer);
  
  const transactionResponse= await fundMe.cheaperWithdraw();
  const transactionReceipt=await transactionResponse.wait(1);
  const {gasUsed,effectiveGasPrice}=transactionReceipt;
  const gasCost=gasUsed.mul(effectiveGasPrice);
  const endingFundmeBalance= await fundMe.provider.getBalance(fundMe.address);
  const endingDeployerBalance= await fundMe.provider.getBalance(deployer);
   
  assert.equal(endingFundmeBalance.toString(),"0");
  assert.equal(startingFundBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());
  })
  
  it("Withdraws Eth - Multiple s_funders", async function(){
    //arrange
  
    const accounts=await ethers.getSigners();
    for(let i=1;i<8;i++){
   const s_fundersConnectedContract=await fundMe.connect(accounts[i]);
   await s_fundersConnectedContract.fund({value:sendEth});
    }
  
    expect(await fundMe.s_funders(0)).to.be.reverted;
  
    const startingFundBalance= await fundMe.provider.getBalance(fundMe.address);
    const startingDeployerBalance=await fundMe.provider.getBalance(deployer);
  
  //act
    const transactionResponse= await fundMe.cheaperWithdraw();
    const transactionReceipt=await transactionResponse.wait(1);
  
   
    const {gasUsed,effectiveGasPrice}=transactionReceipt;
    const gasCost=gasUsed.mul(effectiveGasPrice);
    const endingFundmeBalance= await fundMe.provider.getBalance(fundMe.address);
    const endingDeployerBalance= await fundMe.provider.getBalance(deployer);
  
  //assert
  assert.equal(endingFundmeBalance.toString(),"0");
  assert.equal(startingFundBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString());
  
    for(let i=1;i<8;i++){
  assert.equal(await fundMe.s_addressToAmountFunded(accounts[i].address),0);
    }
  })
  
  it("Only allows owner to withdraw fund", async function(){
    const accounts=await ethers.getSigners()
    const attacker=accounts[1];
    const connectAttackerContract=fundMe.connect(attacker);
    await expect(connectAttackerContract.withdraw()).to.be.reverted
  })
  })
  })

})

