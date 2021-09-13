import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import hre, { ethers } from "hardhat"
import { getNContractAddress } from "../hardhat/utils/contract"
import { TheGaussianProtocol, TheGaussianProtocol__factory } from "../shared/contract_types"

describe("TheGaussianProtocol", function() {
  let owner: SignerWithAddress
  let contract: TheGaussianProtocol

  beforeEach(async function() {
    owner = (await ethers.getSigners())[0]

    const contractFactory = (await ethers.getContractFactory("TheGaussianProtocol", owner)) as TheGaussianProtocol__factory
    contract = await contractFactory.deploy(getNContractAddress(hre))
    await contract.deployed()
  })

  it("getRandomGaussianNumbers should return deterministically generated numbers", async function() {
    const randomNumbers = await contract.getRandomGaussianNumbers("1")
    expect(randomNumbers.map(n => n.toNumber())).to.eql([8, 9, 8, 8, 8, 8, 11, 11])
  })

  it("should have owner equal deployer address", async function() {
    expect(await contract.owner()).to.equal(owner.address)
  })

  it("should have owner equal deployer address", async function() {
    expect(await contract.owner()).to.equal(owner.address)
  })

  it("mintWithN should not allow non-owner to mint the GAUS", async function() {
    let failureReason = "<no failure>"
    try {
      await contract.mintWithN(728)
    } catch (e) {
      failureReason = `${e}`
    }
    expect(failureReason).to.contain("Invalid owner of N")
  })

  it("mintWithN should allow n owner to mint the GAUS", async function() {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x8bf70cab299e353e3c69eb53f943ac62a60b91b8"],
    })

    const impersonatedUser = await ethers.getSigner("0x8bf70cab299e353e3c69eb53f943ac62a60b91b8")

    const impersonatedContract = TheGaussianProtocol__factory.connect(contract.address, impersonatedUser)

    let failureReason = "<no failure>"
    try {
      await impersonatedContract.mintWithN(728)
    } catch (e) {
      failureReason = `${e}`
    }
    expect(failureReason).to.contain("<no failure>")
  })

  it("mint should fail when public sale is inactive", async function() {
    let failureReason = "<no failure>"
    try {
      await contract.mint(728)
    } catch (e) {
      failureReason = `${e}`
    }
    expect(failureReason).to.contain("Public sale is not yet active")
  })

  it("mint should succeed when public sale is active and token is available", async function() {
    await contract.togglePublicSale()

    let failureReason = "<no failure>"
    try {
      await contract.mint(728)
    } catch (e) {
      failureReason = `${e}`
    }
    expect(failureReason).to.contain("<no failure>")
  })

  it("mint should fail when token is unavailable", async function() {
    await contract.togglePublicSale()

    let failureReason = "<no failure>"
    try {
      await contract.mint(728)
      await contract.mint(728)
    } catch (e) {
      failureReason = `${e}`
    }
    expect(failureReason).to.contain("token already minted")
  })

  it("should return expected numbers", async function() {
    await contract.togglePublicSale()
    await contract.mint(728)

    const numbers = await contract.getNumbers(728)
    expect(numbers.map(n => n.toNumber())).to.eql([8, 11, 10, 11, 11, 10, 13, 11])
  })

  type TokenMetadata = {
    name: string,
    description: string
    image: string
  }

  function parseImage(imageStr: string): string {
    const svgHeader = "data:image/svg+xml;base64,"
    if (imageStr.startsWith(svgHeader)) {
      const imageContent = imageStr.substr(svgHeader.length)
      return Buffer.from(imageContent, "base64").toString()
    }
    return imageStr
  }

  function parseMetadata(metadataStr: string): TokenMetadata {
    const metadataHeader = "data:application/json;base64,"
    const metadataBase64 = metadataStr.substr(metadataHeader.length)
    const decodedMetadata = Buffer.from(metadataBase64, "base64").toString()
    const metadata: TokenMetadata = JSON.parse(decodedMetadata)
    return {
      ...metadata,
      image: metadata?.image && parseImage(metadata.image),
    }
  }

  it("should return metadata", async function() {
    await contract.togglePublicSale()
    await contract.mint(728)

    const metadataStr = await contract.tokenURI(728)
    const metadata = parseMetadata(metadataStr)
    expect(metadata.name).to.equal("Gaussian #728")
  })

  it("should return svg image when baseImageURI isn't set", async function() {
    await contract.togglePublicSale()
    await contract.mint(1337)

    const metadataStr = await contract.tokenURI(1337)
    const metadata = parseMetadata(metadataStr)
    expect(metadata.image).to.contain("<svg xmlns")
  })

  it("should return image url when baseImageURI is set", async function() {
    await contract.togglePublicSale()
    await contract.mint(1337)
    await contract.setBaseImageURI("https://thegaussianprotocol.mypinata.cloud/ipfs/QmasMLeVhiBsDGCj43Sn4kndA34tEhG1nR7waxdiwwbpR7/")

    const metadataStr = await contract.tokenURI(1337)
    const metadata = parseMetadata(metadataStr)
    expect(metadata.image).to.contain(".png")
    expect(metadata.image).to.contain("https://thegaussianprotocol.mypinata")
  })

  it("should return metadata url when baseURI is set", async function() {
    await contract.togglePublicSale()
    await contract.mint(1337)
    await contract.setBaseURI("https://gaussianprotocol.io/api/v1/metdata")

    const metadataStr = await contract.tokenURI(1337)
    expect(metadataStr).to.contain("https://gaussianprotocol.io/api/v1/metdata")
  })
})
