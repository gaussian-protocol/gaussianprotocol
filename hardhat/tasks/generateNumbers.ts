import "@nomiclabs/hardhat-ethers"
import * as fs from "fs"
import { task } from "hardhat/config"
import { TheGaussianProtocol__factory } from "../../shared/contract_types"
import { getMainContractAddress } from "../utils/contract"

type Args = {
  startingIndex: number
  endingIndex: number
}

task("generateNumbers", "", async (taskArgs: Args, hre) => {
  const [signer] = await hre.ethers.getSigners()

  const contract = await TheGaussianProtocol__factory.connect(getMainContractAddress(hre), signer)

  const numbers: Array<string> = []
  for (let i = taskArgs.startingIndex; i < 8888; i++) {
    console.log("Getting random numbers for", i)
    const randomNumbers = await contract.getRandomGaussianNumbers(i.toString())
    numbers.push(randomNumbers.map(rn => rn.toString()).join(", "))
  }
  fs.appendFileSync("./numbers.txt", numbers.join("\n"))
  console.log("done")
})
  .addPositionalParam("startingIndex", "")
