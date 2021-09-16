import "@nomiclabs/hardhat-ethers"
import { task } from "hardhat/config"
import { TheGaussianProtocol__factory } from "../../shared/contract_types"
import { getMainContractAddress } from "../utils/contract"
import { promptForGasPrice } from "../utils/gas"

task("togglePublicSale", "", async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners()

  const contract = await TheGaussianProtocol__factory.connect(getMainContractAddress(hre), signer)

  const publicSaleIsActive = await contract.publicSaleActive()
  const gasPrice = await promptForGasPrice(hre, contract.signer)
  const txn = await contract.togglePublicSale({ gasPrice })
  console.log(publicSaleIsActive ? `Pausing public sale: ${txn.hash}` : `Enabling public sale: ${txn.hash}`)
  await txn.wait()
  console.log(publicSaleIsActive ? "Public sale is paused." : "Public sale is active.")
})
