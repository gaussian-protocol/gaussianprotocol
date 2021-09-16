import { EthNetwork, EthNetworkConfig, NETWORK_CONFIG } from "../../shared/config/network"

const ENV_VAR_NET_NAME = "localhost" //process.env.NEXT_PUBLIC_ETH_NETWORK ?? "mainnet"
console.log(`Current Network: ${ENV_VAR_NET_NAME}`)

export function getCurrentNetwork(): EthNetwork {
  const ethNetwork: EthNetwork = EthNetwork[ENV_VAR_NET_NAME.toLowerCase() as EthNetwork]
  if (!ethNetwork) {
    throw new Error(`Unrecognized network found: ${ENV_VAR_NET_NAME}`)
  }
  return ethNetwork
}


export function getNetworkConfig(): EthNetworkConfig {
  return NETWORK_CONFIG[getCurrentNetwork()]
}

export function getNContractAddress(): string {
  return getNetworkConfig().contractConfig.nContractAddress
}

export function getMainContractAddress(): string {
  return getNetworkConfig().contractConfig.mainContractAddress
}

export function getNGraphUrl(): string {
  return getNetworkConfig().nGraphUrl
}

export function getGaussianGraphUrl(): string {
  return getNetworkConfig().gaussianGraphUrl
}

export function getBaseFrontendUrl(): string {
  return getNetworkConfig().baseFrontendUrl
}

export function getBlockExplorerUrl(): string | undefined {
  return getNetworkConfig().blockExplorer
}
