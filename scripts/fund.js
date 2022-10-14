const {getNamedAccounts, ethers}=require("hardhat");
async function main(){
    const {deployer}=await getNamedAccounts();
    const fundMeContract=await ethers.getContractAt("FundMe",deployer)
    console.log("Funding");
    const transactionResponse=await fundMeContract.fund({value: ethers.utils.parseEther("0.1")})
    await transactionResponse.wait(1);
    console.log("Funded");
}

main().then(()=>process.exit(0))
.catch((error)=>{ 
console.log(error)
process.exit(1);
})