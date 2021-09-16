import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useAsyncDebounce } from "../../hooks/useAsyncDebounce"
import { useMainContract } from "../../hooks/useMainContract"
import { useWallet } from "../../hooks/useWallet"
import { parseWalletError } from "../../utils/error"
import { getBlockExplorerUrl } from "../../utils/network"

export type PublicMintStepProps = {
  onSuccess: (tokenId: number) => void
}

export const PublicMintStep: React.FC<PublicMintStepProps> = ({ onSuccess }) => {
  const { wallet } = useWallet()
  const provider = wallet?.web3Provider
  const { mainContract } = useMainContract()
  const [isMinting, setIsMinting] = useState(false)
  const [mintingTxn, setMintingTxn] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tokenId, setTokenId] = useState<number | null>(null)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const canMint = useMemo(() => tokenId !== null && isAvailable === true, [tokenId, isAvailable])
  const isLoading = useMemo(() => tokenId !== null && isAvailable === null, [tokenId, isAvailable])

  const handleMint = useCallback(async () => {
    if (!provider || tokenId === null) return

    try {
      setIsMinting(true)
      setErrorMessage(null)
      const signer = provider.getSigner()
      const contractWithSigner = mainContract.connect(signer)

      const result = await contractWithSigner.mint(tokenId)

      setMintingTxn(result.hash)
      await result.wait()
      onSuccess(tokenId)
    } catch (e) {
      // @ts-ignore
      window.MM_ERR = e
      console.error(`Error while minting: ${e.message}`)
      setMintingTxn(null)
      setErrorMessage(parseWalletError(e) ?? "Unexpected Error")
    } finally {
      setIsMinting(false)
    }
  }, [provider, mainContract, tokenId, onSuccess])

  const checkTokenAvailability = useCallback(
    async (tokenId: number): Promise<void> => {
      if (!process.browser) return
      setIsAvailable(null)

      try {
        setIsAvailable(!Boolean(await mainContract.ownerOf(tokenId)))
      } catch (e) {
        setIsAvailable(true)
      }
    },
    [mainContract],
  )

  const debouncedCheckTokenAvailability = useAsyncDebounce(checkTokenAvailability, 200)

  useEffect(() => {
    if (tokenId !== null) {
      debouncedCheckTokenAvailability(tokenId)
    }
  }, [debouncedCheckTokenAvailability, tokenId])

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
      <Text>Enter the ID of the Gaussian you would like to mint.</Text>

      <Flex
        marginX="auto"
        marginTop={4}
        justifyContent="center"
        alignItems="center"
      >
        <NumberInput onChange={(tokenIdStr, tokenIdNum) => {
          setTokenId(tokenIdNum)
        }}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>

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
      </Box>
      <Box width="90%" maxWidth="400px" marginX="auto">
        {isAvailable === false && (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <Text fontWeight="semibold" marginRight={1}>
              Error:
            </Text>
            Token has already been claimed
          </Alert>
        )}
      </Box>
      <Box>
        <Button
          display="inline-block"
          ml={2}
          isLoading={isLoading || isMinting}
          onClick={handleMint}
          letterSpacing="3px"
          textTransform="uppercase"
          isDisabled={!canMint}
        >
          Mint
        </Button>
      </Box>
    </Box>
  )
}
