const express = require('express');
const app = express();
require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
var bodyParser = require('body-parser');
const cors = require('cors')
const { ethers } = require("hardhat");
app.use(cors())
app.use(bodyParser.json());
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)
const contract = require("../crypto-jewel-ethereum-chain/artifacts/contracts/RingToken.sol/RingToken.json")
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multipart = require('connect-multiparty');
const os = require('os')
var path = require('path');
var solc = require('solc');
const multipartMiddleware = multipart({
  uploadDir: os.tmpdir()
});
//const contractAddress = "0xf3047129812b877d1ab1f051a0c4a08202fb600c"
// const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
async function mintNFT(tokenURI,contractAddress,nftContract) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") + 1 //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}
// mintNFT("QmPJWwzXWoEJm8MHn8LDrhKk3kftX8WyL83WGjyjLgaU97")
/*
create a server on port 3000
*/

// connect user wallet and save public address in database
app.post('/',async (req,res)=>{

    // get address and save it into the database 


})

app.post('/mintNft',multipartMiddleware,async(req,res)=>{
 //deploy contract  and mint NFT
 console.log("reqBody---",JSON.parse(req.body.jsonBody))
 console.log("minting NFT")
 // deploy contract
 const filePath = path.join(__dirname, 'assets/unsplash.jpg')
//  console.log("klkl",filePath);
//  console.log("filePath---",filePath)
 const MyNFT = await ethers.getContractFactory("RingToken")
 // Start deployment, returning a promise that resolves to a contract object
 const myNFT = await MyNFT.deploy()
 console.log("Contract deployed to address:", myNFT.address)
const contractAddress = myNFT.address 
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
var fileToIpfs;
try {
  fileToIpfs = await pinFileToIPFS(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY,
    filePath,
    JSON.parse(req.body.jsonBody).nftName,
    JSON.parse(req.body.jsonBody).nftDescription
  ).then(function(response) {
    console.log("response",response) 
    return response.data.IpfsHash
  });
} catch (error) {
  console.log(error);
}
//console.log("fileToIpfs",fileToIpfs)
let tokenURI = fileToIpfs
// call mint nft function
mintNFT(tokenURI,contractAddress,nftContract)
// https://gateway.pinat/ipfs/QmZHUb7djULs2xwGYiK14L4VrTe2Tt6bdU1nw327ZDQnkM"

})
  const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey,file,name,description) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append('file', fs.createReadStream(file));
  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
      name: name,
      keyvalues: {
          exampleKey: description
      }
  });
  data.append('pinataMetadata', metadata);
  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
      cidVersion: 0,
      customPinPolicy: {
          regions: [
              {
                  id: 'FRA1',
                  desiredReplicationCount: 1
              },
              {
                  id: 'NYC1',
                  desiredReplicationCount: 2
              }
          ]
      }
  });
  data.append('pinataOptions', pinataOptions);
  return axios
      .post(url, data, {
          maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
          headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey
          }
      })
      .then(function(response) {
          //handle response here
         // console.log("res--",response);
          return response;
      })
      .catch(function (error) {
          //handle error here
          console.log("error",error);
          return error;
      });
};















const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});