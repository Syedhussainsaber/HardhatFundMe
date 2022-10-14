const { network } = require("hardhat")
const { networkConfig, developmentNames } = require("../helper-hardhatConfig")
const verify  = require("../Utils/verify")

// require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy,log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethToUsdAddress"]
    }
log(`${network.name}`);
    log("Deploying FundMe and waiting for confirmations...")
    // const args=[ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("----------------------------------------------------")

    log(`FundMe deployed at ${fundMe.address}`)

    if(!developmentNames.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify.verify(fundMe.address,[ethUsdPriceFeedAddress]);
    }
    // if (
    //     !developmentChains.includes(network.name) &&
    //     process.env.ETHERSCAN_API_KEY
    // ) {
    //     await verify(fundMe.address, [ethUsdPriceFeedAddress])
    // }
}

module.exports.tags = ["all", "fundme"]
