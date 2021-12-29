import { task, types } from 'hardhat/config'
import "@nomiclabs/hardhat-waffle"
import {NFT} from "../typechain"

task("grantRedeemerRole", "Grants redeemer role to user")
.addParam("user", "user address")
.addParam("token", "token address")
  .setAction(async (args, hre) => {
    const contract = await hre.ethers.getContractAt("NFT", args.token) as NFT;
    await contract.grantRole(await contract.REDEEMER_ROLE(), args.user);
  });