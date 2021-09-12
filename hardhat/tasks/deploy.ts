import "@nomiclabs/hardhat-ethers"
import { task } from "hardhat/config"
import { TheGaussianProtocol__factory } from "../../shared/contract_types"
import { getNContractAddress, persistMainContractAddress } from "../utils/contract"

task("deploy", "Deploy main contract", async (taskArgs, hre) => {
  await hre.run("compile")

  const contractFactory = (await hre.ethers.getContractFactory("TheGaussianProtocol")) as TheGaussianProtocol__factory

  const contract = await contractFactory.deploy(getNContractAddress(hre))
  const deployed = await contract.deployed()

  persistMainContractAddress(hre, deployed.address)
  console.log(`Contract has been deployed to: ${deployed.address}`)
})
