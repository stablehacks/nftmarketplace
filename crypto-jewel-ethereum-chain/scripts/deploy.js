async function main() {
    const MyNFT = await ethers.getContractFactory("MyNFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const myNFT = await MyNFT.deploy()
    console.log("Contract deployed to address:", myNFT.address)
    return myNFT.address
  }
  module.exports = main
  // main()
  //   .then(() => process.exit(0))
  //   .catch((error) => {
  //     console.error(error)
  //     process.exit(1)
  //   })
  