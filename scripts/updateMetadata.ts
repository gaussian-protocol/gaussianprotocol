import { forceRefreshMetadata } from "../shared/clients/opensea"
import { sleep } from "../shared/utils/async"

export async function main() {
  for (let i = 2677; i < 8888; i++) {
    try {
      console.log(`Updating Token #${i}...`)
      await forceRefreshMetadata(i)
    } catch (e) {
      console.error(`Failed to update token #${i} - ${e}`)
    } finally {
      await sleep(500)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
