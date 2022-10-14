const {networkConfig}={
    31337: {
        name: "localhost",
    },
    5:{
        name:"goerli",
        "ethToUsdAddress":"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    80001:{
        name:"mumbai",
        "ethToUsdAddress":"0x0715A7794a1dc8e42615F059dD6e406A6594651A"
    }
}
const developmentNames=["hardhat","localhost"];


module.exports={
    networkConfig,developmentNames
}