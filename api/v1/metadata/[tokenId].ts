import { exists } from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import * as path from "path"
import { promisify } from "util"
import { getGaussianById } from "../../../shared/clients/gaussians"
import { getTokenId } from "../../_lib/params"

const existsAsync = promisify(exists)

const description = "A set of 8 random numbers whose rarity follows a Gaussian distribution. Generated and stored on-chain using the power of the central limit theorem."

const RARITY_MAPPINGS: Record<string, Array<number>> = {
  "Commons": [8, 9, 10, 11, 12],
  "Uncommons": [6, 7, 13, 14],
  "Rares": [4, 5, 15, 16],
  "Epics": [2, 3, 17, 18],
  "Legendaries": [0, 1, 19, 20],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const tokenId = getTokenId(req)
    if (tokenId === undefined) {
      res.end(JSON.stringify({ error: "Invalid tokenId" }))
      return
    }

    const token = await getGaussianById(tokenId)
    if (!token) {
      res.status(404).end(JSON.stringify({ error: "Token not found" }))
      return
    }

    const highFidelityAssetExists = await existsAsync(path.join(__dirname, "../../../public/gaussians", `${tokenId}.png`))
    const highFidelityAddress = `https://www.gaussianprotocol.io/gaussians/${tokenId}.png`

    const metadata = {
      name: token.name,
      description,
      image: highFidelityAssetExists ? highFidelityAddress : token.imageURI,
      attributes: [
        {
          "trait_type": "1st",
          "value": token.first.toString(),
        },
        {
          "trait_type": "2nd",
          "value": token.second.toString(),
        },
        {
          "trait_type": "3rd",
          "value": token.third.toString(),
        },
        {
          "trait_type": "4th",
          "value": token.fourth.toString(),
        },
        {
          "trait_type": "5th",
          "value": token.fifth.toString(),
        },
        {
          "trait_type": "6th",
          "value": token.sixth.toString(),
        },
        {
          "trait_type": "7th",
          "value": token.seventh.toString(),
        },
        {
          "trait_type": "8th",
          "value": token.eighth.toString(),
        },
        {
          "trait_type": "Sum",
          "value": token.numbers.reduce((prev, next) => prev + next, 0).toString(),
        },
        ...(Object.entries(RARITY_MAPPINGS).map(([label, numbers]: [string, Array<number>]) => {
          const count = token.numbers.reduce((prev, next) => {
            if (numbers.includes(next)) {
              return prev + 1
            }
            return prev
          }, 0)

          if (count === 0) {
            return
          }

          return {
            "trait_type": label,
            "value": count,
          }
        })).filter(n => n),
      ],
    }

    res.end(JSON.stringify(metadata, null, 2))
  } catch {
    res.status(500).end(JSON.stringify({ error: "Unexpected server error" }))
  }
}
