/* eslint-disable @next/next/no-img-element */

import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { parseMetadata } from "../../../shared/utils/metadata"
import { useMainContract } from "../../hooks/useMainContract"
import { getNetworkConfig } from "../../utils/network"
import { ROUTES } from "../../utils/routing"

export type SuccessStepProps = {
  tokenId: number
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ tokenId }) => {
  const { mainContract } = useMainContract()
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const router = useRouter()

  const retrieveTokenAsset = useCallback(
    async (tokenId: number) => {
      const encodedMetadata = await mainContract.tokenURI(tokenId)
      const parsedMetadata = parseMetadata(encodedMetadata, false)
      console.log("parsedMetadata")
      console.log(parsedMetadata)
      console.log("----")
      setSvgContent(parsedMetadata.image)
    },
    [mainContract],
  )

  const handleDone = useCallback(() => {
    router.push(ROUTES.Home)
  }, [router])

  useEffect(() => {
    retrieveTokenAsset(tokenId)
  }, [retrieveTokenAsset, tokenId])

  const openSeaUrl: string | undefined = useMemo(() => {
    if (!process.browser) return

    const {
      openSeaBaseUrl,
      contractConfig: { mainContractAddress },
    } = getNetworkConfig()
    if (!openSeaBaseUrl) return

    return `${openSeaBaseUrl}/assets/${mainContractAddress}/${tokenId}`
  }, [tokenId])

  return (
    <Box textAlign="center" width="full">
      <Heading as="h1" size="4xl" fontSize={["4xl", "5xl", "6xl"]} mb={4} fontFamily="pixel" letterSpacing="5px">
        Success!
      </Heading>
      <Text>You have minted Gaussian #{tokenId}</Text>
      <Box maxWidth="400px" width="90%" marginX="auto" marginY={3}>
        <Box
          backgroundColor="gray.800"
          borderWidth="4px"
          borderColor="transparent"
          borderStyle="solid"
          width="full"
        >
          <img src={svgContent ?? undefined} />
        </Box>
      </Box>

      {openSeaUrl && (
        <Flex justifyContent="center" marginTop={12}>
          <Link href={openSeaUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">View on OpenSea</Button>
          </Link>
        </Flex>
      )}

      <Box marginTop={8}>
        <Button
          onClick={handleDone}
          letterSpacing="3px"
          textTransform="uppercase"
        >
          Done
        </Button>
      </Box>
    </Box>
  )
}
