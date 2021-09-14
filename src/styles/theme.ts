import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: "Source Serif Pro",
    body: "Pixelar Regular W01 Regular",
    pixel: "Pixelar Regular W01 Regular",
  },
  styles: {
    global: {
      body: {
        bg: "#000000",
        color: "white",
      },
    },
  },
})
export default theme
