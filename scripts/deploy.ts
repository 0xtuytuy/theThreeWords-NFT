import {ethers} from "hardhat"
import {NFT__factory} from "../typechain"

async function deploy() { 
    const factory = await ethers.getContractFactory('NFT') as NFT__factory
    
    console.log("Starting deploying token")
    const nft = await factory.deploy(process.env.NAME, process.env.SYMBOL, process.env.MEDIA_URI, process.env.TOKEN_URI, process.env.RECIEVER, process.env.PICTURE_MUSIC_I, process.env.PICTURE_MUSIC_LOVE, process.env.PICTURE_MUSIC_YOU)
    console.log("nft token deployed with address: " + nft.address);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });