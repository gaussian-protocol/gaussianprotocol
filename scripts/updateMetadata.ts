import fs from "fs"
import path from "path"
import { forceRefreshMetadata } from "../shared/clients/opensea"
import { sleep } from "../shared/utils/async"

const IMAGES_DIR = path.join(__dirname, "../public/gaussians")

export async function main() {
  const tokenWithImageIds = fs.readdirSync(IMAGES_DIR).filter((filename) => filename.endsWith(".png")).map((f) => parseInt(f.substr(0, f.length - 4)))
  let i = 0
  for (const tokenId of tokenWithImageIds) {
    console.log(`Refreshing token #${tokenId} - i${i}`)
    await forceRefreshMetadata(tokenId)
    await sleep(2000)
    i++
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
