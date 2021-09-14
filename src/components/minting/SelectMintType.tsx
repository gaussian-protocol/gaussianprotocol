import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import React, { useCallback, useEffect, useState } from "react"
import { PUBLIC_SALE_DATETIME } from "../../../shared/config/base"
import { useMainContract } from "../../hooks/useMainContract"
import { Countdown } from "../Countdown"
import { MintingType } from "./MintingType"


export type SelectMintTypeProps = {
  onSelectMintType: (mintType: MintingType) => void
}

export const SelectMintType: React.FC<SelectMintTypeProps> = ({ onSelectMintType }) => {
  const { mainContract } = useMainContract()
  const [publicSaleIsActive, setPublicSaleIsActive] = useState(false)

  const checkPublicSaleStatus = useCallback(async () => {
    try {
      setPublicSaleIsActive(await mainContract.publicSaleActive())
    } catch (e) {
      console.error(`Unexpected error occurred while checking public sale status: ${e}`)
    }
  }, [mainContract])

  useEffect(() => {
    checkPublicSaleStatus()
  }, [checkPublicSaleStatus])

  return (
    <Box textAlign="center" width="full">
      <Heading as="h1" size="4xl" fontSize={["4xl", "5xl", "6xl"]} mb={4} fontFamily="pixel" letterSpacing="5px">
        Select Mint Type
      </Heading>

      <Flex
        direction={["column", null, "row"]}
        maxWidth="800px"
        marginX="auto"
        marginTop={12}
      >
        <Flex
          direction="column"
          flex={1}
          border="1px solid white"
          paddingX={4}
          paddingY={8}
          borderRadius={8}
          marginRight={[0, null, 8]}
          marginBottom={[8, null, 0]}
        >
          <Text fontSize="1.25rem" flex={1}>
            To honor the N project&apos;s innovation in the space we are allowing each N holder
            to mint the Gaussian of the same ID with priority
          </Text>

          <Box>
            <Button
              size="lg"
              letterSpacing="5px"
              textTransform="uppercase"
              mt={6}
              mb={1}
              onClick={() => {
                onSelectMintType(MintingType.WithN)
              }}
            >
              Mint with N
            </Button>
          </Box>
        </Flex>

        <Box
          flex={1}
          border="1px solid white"
          paddingX={4}
          paddingY={8}
          borderRadius={8}
          marginLeft={[0, null, 8]}
        >
          <Text fontSize="1.25rem">
            Non-holders will be offered the opportunity to claim any unclaimed Gaussians after
            the priority period has elapsed
          </Text>

          <Countdown
            to={PUBLIC_SALE_DATETIME}
            textProps={{ fontSize: "3rem" }}
            readyText="NOW ACTIVE"
            forceReady={publicSaleIsActive}
          />

          <Button
            size="lg"
            letterSpacing="5px"
            textTransform="uppercase"
            mt={6}
            mb={1}
            isDisabled={!publicSaleIsActive}
            onClick={() => {
              onSelectMintType(MintingType.Public)
            }}
          >
            Public Mint
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
