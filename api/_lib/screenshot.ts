import chrome from "chrome-aws-lambda"
import puppeteer from "puppeteer-core"

const isDev = process.env.NODE_ENV === "development"

/**
 * In order to have the function working in both windows and macOS
 * we need to specify the respecive path of the chrome executable for
 * both cases.
 */
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

interface PuppeteerOptions {
  args: string[];
  executablePath: string;
  headless: boolean;
}

export const getOptions = async (isDev: boolean): Promise<PuppeteerOptions> => {
  /**
   * If used in a dev environment, i.e. locally, use one of the local
   * executable path
   */
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    }
  }
  /**
   * Else, use the path of chrome-aws-lambda and its args
   */
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  }
}

export const getScreenshot = async (url: string): Promise<Buffer | string> => {
  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  /**
   * Here we set the viewport manually to a big resolution
   * to ensure the target,i.e. our code snippet image is visible
   */
  await page.setViewport({
    width: 2560,
    height: 1080,
    deviceScaleFactor: 2,
  })

  /**
   * Navigate to the url generated by getCarbonUrl
   */
  await page.goto(url, { waitUntil: "load" })

  await page.waitForSelector(".loaded-token")
  const exportContainer = await page.waitForSelector(".token-screenshot-target")
  if (!exportContainer) {
    throw new Error("Cannot find loaded Token")
  }

  const elementBounds = await exportContainer?.boundingBox()
  if (!elementBounds) {
    throw new Error("Cannot get export container bounding box")
  }

  const buffer = await exportContainer.screenshot({
    encoding: "binary",
    clip: {
      ...elementBounds,
      /**
       * Little hack to avoid black borders:
       * https://github.com/mixn/carbon-now-cli/issues/9#issuecomment-414334708
       */
      x: Math.round(elementBounds.x),
      height: Math.round(elementBounds.height) - 1,
    },
  })

  if (!buffer) {
    throw new Error("Error outputting image buffer")
  }

  /**
   * Return the buffer representing the screenshot
   */
  return buffer
}