import { Alert, AlertIcon, Box, Button, Heading, Link, Text } from "@chakra-ui/react"
import React, { useCallback, useMemo, useState } from "react"
import { SubgraphN } from "../../../shared/clients/n"
import { useMainContract } from "../../hooks/useMainContract"
import { useWallet } from "../../hooks/useWallet"
import { parseWalletError } from "../../utils/error"
import { getBlockExplorerUrl } from "../../utils/network"
import NCard from "../NCard/NCard"

export type MintStepProps = {
  selectedN: SubgraphN
  onCancel: () => void
  onSuccess: (tokenId: number) => void
}

export const MintStep: React.FC<MintStepProps> = ({ selectedN, onCancel, onSuccess }) => {
  const { wallet } = useWallet()
  const provider = wallet?.web3Provider
  const { mainContract } = useMainContract()
  const [isMinting, setIsMinting] = useState(false)
  const [mintingTxn, setMintingTxn] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const numericId = parseInt(selectedN.id)

  const handleMint = useCallback(async () => {
    if (!provider) return
    try {
      setIsMinting(true)
      setErrorMessage(null)
      const signer = provider.getSigner()
      const contractWithSigner = mainContract.connect(signer)

      const result = await contractWithSigner.mintWithN(numericId)

      setMintingTxn(result.hash)
      await result.wait()
      onSuccess(numericId)
    } catch (e) {
      // @ts-ignore
      window.MM_ERR = e
      console.error(`Error while minting: ${e.message}`)
      setMintingTxn(null)
      setErrorMessage(parseWalletError(e) ?? "Unexpected Error")
    } finally {
      setIsMinting(false)
    }
  }, [provider, mainContract, numericId, onSuccess])

  const transactionUrl: string | undefined = useMemo(() => {
    if (!mintingTxn || !isMinting) {
      return
    }
    const blockExplorerUrl = getBlockExplorerUrl()
    if (!blockExplorerUrl) {
      return
    }
    return `${blockExplorerUrl}/tx/${mintingTxn}`
  }, [isMinting, mintingTxn])

  return (
    <Box textAlign="center" width="full">
      <Heading as="h1" size="4xl" fontSize={["4xl", "5xl", "6xl"]} mb={4} fontFamily="pixel" letterSpacing="5px">
        Mint Gaussian
      </Heading>
      <Text>You are about to mint a Gaussian with N #{selectedN.id}</Text>
      <Box
        maxWidth="400px"
        width="90%"
        marginX="auto"
        marginY={3}
        borderWidth="4px"
        borderColor="transparent"
        borderStyle="solid"
      >
        {errorMessage && (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <Text fontWeight="semibold" marginRight={1}>
              Error:
            </Text>
            {errorMessage}
          </Alert>
        )}
        {transactionUrl && (
          <Link href={transactionUrl} target="_blank" rel="noopener noreferrer">
            <Alert status="info" flexDirection={["column", "row"]} mb={3}>
              <AlertIcon />
              <Text fontWeight="semibold" marginRight={2}>
                Minting in progress
              </Text>
              <Text>Click to view transaction</Text>
            </Alert>
          </Link>
        )}

        <Box
          backgroundColor="gray.800"
          borderWidth="4px"
          borderColor="transparent"
          borderStyle="solid"
          width="full"
          position="relative"
        >
          <NCard n={selectedN} />
        </Box>
      </Box>
      <Box>
        <Button
          onClick={onCancel}
          display="inline-block"
          mr={2}
          isDisabled={isMinting}
          letterSpacing="3px"
          textTransform="uppercase"
        >
          Cancel
        </Button>
        <Button
          display="inline-block"
          ml={2}
          isLoading={isMinting}
          onClick={handleMint}
          letterSpacing="3px"
          textTransform="uppercase"
        >
          Mint
        </Button>
      </Box>
    </Box>
  )
}
