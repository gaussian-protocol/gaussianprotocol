import { Box, Button, Flex, Image, Stack, StackItem, Text } from "@chakra-ui/react"

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
        opacity={0}
        width="100%"
        maxWidth="900px"
        marginX="auto"
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Box position="relative" zIndex={1} mb={[16, null, 24]}>
          <Image
            width="full"
            src="/gaussian_protocol_logo.png"
            alt="The Gaussian Protocol"
            mb={[8, null, 12]}
          />
          <Flex justifyContent="flex-end" mb={[8, null, 12]}>
            <Box>
              <Image
                maxWidth={["100px", "150px", "200px"]}
                marginX="auto"
                src="/volume_one_label.png"
                alt="Volume One"
              />
            </Box>
          </Flex>
          <Image
            width="35%"
            maxWidth="250px"
            marginX="auto"
            src="/gaus_graph_icon_large.png"
            alt="Gaussian Graph Icon"
          />
        </Box>
        <Flex marginX="5%" direction="column">
          <Flex>
            <Box textAlign="left">
              <Image
                width={["100%", null, "75%"]}
                src="/section_1_header.svg"
                alt="What is a gaussian distribution?"
                mb={4}
              />
            </Box>
          </Flex>
          <Box marginX="6%" textAlign="left">
            <Text marginBottom={[6, null, 12]}>
              I'm sure you've all heard of "the bell curve" when exams were passed back during
              your school years... there was always that *one kid* that was messing up "the curve"
              (it was probably all you crypto enthusiasts reading this right now). Well, a
              gaussian distribution is exactly that - a bell-shaped curvature that describes how
              random an event is, named after the german physicist Johann Carl Friedrich Gauss.
            </Text>
            <Flex direction={["column", null, "row"]}>
              <Box flex={1}>
                <Image
                  flex={1}
                  src="/gaussian_distribution_graph.svg"
                  alt="Gaussian Graph"
                  mb={4}
                />
              </Box>
              <Flex flex={1} direction="column">
                <Flex alignItems="flex-start">
                  <Image
                    src="/dice_icon.svg"
                    alt="Dice Icon"
                    width="6%"
                    marginRight={3}
                    marginTop={1}
                  />
                  <Text marginBottom={[6, null, 12]} flex={1}>
                    And, the rarity goes both ways! You can get a really rare low value
                    <Box as="span" color="red.500" mx={1}>(critical failure!)</Box>
                    or a really high value <Box as="span" color="green.500" mx={1}>(critical success!).</Box>
                  </Text>
                </Flex>
                <Flex justifyContent={["center", null, "flex-end"]}>
                  <Image
                    src="/pixel_arrows.svg"
                    alt="Pixel arrows"
                    marginRight={[0, null, 8]}
                    width={["90%", null, "65%"]}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Box>

          <Flex marginTop={[12, null, 24]}>
            <Box textAlign="left">
              <Image
                width={["100%", null, "75%"]}
                src="/section_2_header.svg"
                alt="Who cares? Nature does"
                mb={4}
              />
            </Box>
          </Flex>

          <Flex direction={["column", null, "row"]} marginX="6%">
            <Box flex={1} display={["none", null, "initial"]}>
              <Image
                flex={1}
                src="/human_gaussian.svg"
                alt="Human gaussian"
                mb={4}
              />
            </Box>
            <Box flex={2} textAlign={["left", null, "right"]} paddingLeft={[0, null, 4]}>
              <Text marginBottom={4} flex={1}>
                Well... for starters, nature does. This is how the universe tends to distribute
                it's most beautifully complex traits! As an example, when your parents minted you
                and entered their DNA hashes into the
                <Box as="span" color="#00AEEF" mx={1}>HUMANBIRTH.SOL</Box>
                <Box display="inline-block" width="20px" borderBottom="2px solid #00AEEF" height="20px" mr={2} />
                contract, the randomness of
                your genetic phenotypes (traits) follow a gaussian distribution.
              </Text>
              <Box display={["block", null, "none"]} width="70%" marginX="auto">
                <Image
                  display={["block", null, "none"]}
                  marginX="auto"
                  flex={1}
                  src="/human_gaussian.svg"
                  alt="Human gaussian"
                  mb={4}
                />
              </Box>
              <Text marginBottom={4} textAlign={["center", null, "right"]}>
                It's the <Box as="span" color="#00AEEF" mx={1}>most natural way</Box> to
                <Box as="span" color="#00AEEF" mx={1}>treat rarity.</Box>
              </Text>

              <Text flex={1} marginTop={4}>
                The Gaussian Protocol team cares as well. We were deeply inspired by both the
                n project and Loot and we wanted to present to the ever-generative NFT metaverse
                seed numbers that intrinsically come prebundled with a logical sense of rarity.
                When creatives and developers choose to use the Gaussian Protocol in their work,
                they can focus on what's important and leave the math to us.
              </Text>
            </Box>
          </Flex>
          <Box marginX="6%" marginY={[6, null, 12]}>
            <Image
              marginX={["auto", null, "15%"]}
              maxWidth="60px"
              src="/pixel_down_arrows.svg"
              alt="Down arrows"
            />
          </Box>
          <Flex marginTop={[12, null, 24]}>
            <Box textAlign="left">
              <Image
                src="/section_3.svg"
                alt="Enter the Gaussian Protocol"
                mb={4}
              />
            </Box>
          </Flex>

          <Flex marginTop={[12, null, 24]}>
            <Box textAlign="left">
              <Image
                width={["100%", null, "70%"]}
                src="/section_4_header.svg"
                alt="Endless possibilities"
                mb={4}
              />
            </Box>
          </Flex>

          <Stack direction={["column", null, "row"]} spacing={[12, null, 6]} marginX="6%">
            <StackItem display="flex" flexDirection="column" flex={1} alignItems="center">
              <Text minHeight={[0, null, "48px"]} maxWidth={["full", null, "70%"]}>RPG CHARACTER GENERATION</Text>
              <Image
                marginY={3}
                width={["70%", null, "full"]}
                marginX="auto"
                src="/gaussian_cart_1.svg"
                alt="Gaussian cartridge 1"
                minHeight={[0, null, "216px"]}
              />
              <Image
                marginX="auto"
                width={["10%", null, "20%"]}
                marginBottom={1}
                src="/star_icon.svg"
                alt="Star icon"
              />
              <Text>Your unique character</Text>
            </StackItem>
            <StackItem display="flex" flexDirection="column" flex={1} alignItems="center">
              <Text minHeight={[0, null, "48px"]} maxWidth={["full", null, "70%"]}>LOOT DROP GENERATION</Text>
              <Image
                marginY={3}
                width={["70%", null, "full"]}
                marginX="auto"
                src="/gaussian_cart_2.svg"
                alt="Gaussian cartridge 1"
                minHeight={[0, null, "216px"]}
              />
              <Image
                marginX="auto"
                width={["10%", null, "20%"]}
                marginBottom={1}
                src="/star_icon.svg"
                alt="Star icon"
              />
              <Text>Your unique loot</Text>
            </StackItem>
            <StackItem display="flex" flexDirection="column" flex={1} alignItems="center">
              <Text minHeight={[0, null, "48px"]} maxWidth={["full", null, "70%"]}>GENERATIVE ART</Text>
              <Image
                marginY={3}
                width={["70%", null, "full"]}
                marginX="auto"
                src="/gaussian_cart_1.svg"
                alt="Gaussian cartridge 1"
                minHeight={[0, null, "216px"]}
              />
              <Image
                marginX="auto"
                width={["10%", null, "20%"]}
                marginBottom={1}
                src="/star_icon.svg"
                alt="Star icon"
              />
              <Text>Your unique art</Text>
            </StackItem>
            <StackItem display="flex" flexDirection="column" flex={1} alignItems="center">
              <Text minHeight={[0, null, "48px"]} maxWidth="90%">ON-CHAIN, SCIENTIFIC SIMULATIONS</Text>
              <Image
                marginY={3}
                width={["70%", null, "full"]}
                marginX="auto"
                src="/gaussian_cart_2.svg"
                alt="Gaussian cartridge 1"
                minHeight={[0, null, "216px"]}
              />
              <Image
                marginX="auto"
                width={["10%", null, "20%"]}
                marginBottom={1}
                src="/star_icon.svg"
                alt="Star icon"
              />
              <Text>Your unique results</Text>
            </StackItem>
          </Stack>

          <Image
            width="35%"
            maxWidth="150px"
            marginX="auto"
            marginTop={[12, null, 24]}
            src="/gaus_graph_icon_small.svg"
            alt="Gaussian Graph Icon"
          />
          <Text fontSize={["1.5rem", null, "3rem"]} letterSpacing={["5px", null, "10px"]}>INSERT CARTRIDGE</Text>

          <Box textAlign="center" my={8}>
            {isConnected ? (
              <Button onClick={handleGetStarted} size="lg" letterSpacing="5px" textTransform="uppercase">
                Get Started
              </Button>
            ) : (
              <Box>
                <ConnectWalletButton />
              </Box>
            )}
          </Box>
        </Flex>
      </MotionBox>
    </Layout>
  )
}
