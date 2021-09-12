import { Box, Button, Heading, Text } from "@chakra-ui/react"

import "@fontsource/source-serif-pro/400.css"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import React, { useCallback } from "react"
import { ConnectWalletButton } from "../components/ConnectWalletButton"
import { ExternalLogos } from "../components/ExternalLogos"
import Layout from "../components/Layout"
import { useWallet } from "../hooks/useWallet"
import { ROUTES } from "../utils/routing"

const MotionBox = motion(Box)

export default function Home() {
  const { isConnected } = useWallet()

  const router = useRouter()
  const handleGetStarted = useCallback(() => {
    router.push(ROUTES.Mint)
  }, [router])

  return (
    <Layout headerContent={<ExternalLogos />} hideLogo>
      <MotionBox
        textAlign="center"
        width="full"
        opacity={0}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Box position="relative" zIndex={1}>
          <Heading
            as="h1"
            size="4xl"
            fontSize={["5xl", "5xl", "7xl"]}
            fontWeight="400"
            mb={2}
            color="#9999"
          >
            The Gaussian Protocol
          </Heading>
          <Text fontSize={["1.25rem"]} color="whiteAlpha.700">
            A set of 8 random numbers whose rarity follows a Gaussian distribution. Generated and stored on-chain using
            the power of the central limit theorem.
          </Text>
        </Box>

        <Box textAlign="center" my={8}>
          {isConnected ? (
            <Button onClick={handleGetStarted} size="lg">
              Get Started
            </Button>
          ) : (
            <Box>
              <ConnectWalletButton />
            </Box>
          )}
        </Box>
      </MotionBox>
    </Layout>
  )
}
