import { writeFileSync } from "fs"
import path from "path"
import { getGaussianById } from "../shared/clients/gaussians"


type SerializedToken = {
  id: number
  numbers: Array<number>
}

export async function main() {
  const errorIds: Array<number> = []

  const chunks = 4
  const totalSize = 8888
  const chunkSize = totalSize / chunks

  for (let k = 0; k < chunks; k++) {
    const tokenData: Array<SerializedToken> = []

    for (let i = k * chunkSize; i < ((k + 1) * chunkSize); i++) {
      console.log(`Fetching Token ID #${i}`)
      try {
        const token = await getGaussianById(i)
        if (!token) {
          throw new Error(`No token found for ID ${i}`)
        }

        tokenData.push({
          id: token.numericId,
          numbers: token.numbers,
        })
      } catch {
        console.error(`Error fetching #${i}`)
        errorIds.push(i)
      }
    }
    const TOKEN_FILE = path.join(__dirname, `./TOKEN_DATA_${k}.json`)
    console.log(`Saving file: ${TOKEN_FILE}`)
    writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2))
  }
  console.log("Errors found for following ids: ", errorIds)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
