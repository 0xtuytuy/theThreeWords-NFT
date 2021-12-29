import { expect } from "chai";
import { ethers, network } from 'hardhat';
import "@nomiclabs/hardhat-web3";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {NFT, NFT__factory} from "../typechain"

let nft: NFT;

let owner: SignerWithAddress;
let user_one: SignerWithAddress;
let user_two: SignerWithAddress;
let user_three: SignerWithAddress;

describe('NFT', () => {
    before(async () => {
        [owner, user_one, user_two, user_three] = await ethers.getSigners();
        let Nft = await ethers.getContractFactory('NFT') as NFT__factory;
        nft = await Nft.deploy("The Three Words", "TTW", "ar://pcyzRXTioklW9Ouo7BlOTR4UGjRzw4Ow7gEwYnjGtMg", "ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6AzU", owner.address, "ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azp", "ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azre", "ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azte") as NFT
    });

    describe("Deploy", ()=>{
        it("Constructor arguments", async()=>{
            expect(await nft.name()).to.equal("The Three Words")
            expect(await nft.symbol()).to.equal("TTW")
            expect(await nft.mediaURI()).to.equal("ar://pcyzRXTioklW9Ouo7BlOTR4UGjRzw4Ow7gEwYnjGtMg")
            expect(await nft.tokenURI(0)).to.equal("ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6AzU")
            expect(await nft.ownerOf(0)).to.equal(owner.address)
        })
        it("Initial NFT royalty receiver owner", async()=>{
            expect(await nft.royaltyReciever()).to.equal(owner.address)
        })
        it("Roles", async()=>{
            expect(await nft.hasRole(await nft.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true)
            expect(await nft.hasRole(await nft.REDEEMER_ROLE(), owner.address)).to.equal(true)
        })
        it("Check music sheet url available",async()=>{
            expect(await nft.musicSheetI()).to.equal("ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azp")
            expect(await nft.musicSheetLove()).to.equal("ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azre")
            expect(await nft.musicSheetYou()).to.equal("ar://5HoU3nk0WmOPH-JGzgtT9W9l2VNQTRKz_Pwp_ux6Azte")
        })
    })
    describe("Functionality", ()=>{
        it("Transfers and approve", async()=>{
            await nft.transferFrom(owner.address, user_one.address, 0)
            expect(await nft.ownerOf(0)).to.equal(user_one.address)
            await nft.connect(user_one).approve(owner.address, 0)
            await nft.transferFrom(user_one.address, owner.address, 0)
            expect(await nft.ownerOf(0)).to.equal(owner.address)
        })
        it("Redeem", async()=>{
            await nft.redeem()
            expect(await nft.redeemed()).to.equal(true)
        })
        it("Royalty info ERC2981", async()=>{
            let res = await nft.royaltyInfo(0, "50000")
            expect(res.receiver).to.equal(owner.address)
            expect(res.royaltyAmount).to.equal("5000")
        })
    })
    describe("Restrictions", ()=>{
        it("Shouldn't transfer without approve", async()=>{
            await expect(nft.connect(user_one).transferFrom(owner.address, user_one.address, 0)).to.revertedWith("ERC721: transfer caller is not owner nor approved")
        })
        it("Shouldn't execute redeem without role", async()=>{
            await expect(nft.connect(user_one).redeem()).to.revertedWith("missing role")
        })
    })
})