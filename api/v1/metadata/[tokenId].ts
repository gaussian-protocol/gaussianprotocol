import { exists } from "fs"
import type { NextApiRequest, NextApiResponse } from "next"
import * as path from "path"
import { promisify } from "util"
import { getGaussianById } from "../../../shared/clients/gaussians"
import { getTokenId } from "../../_lib/params"

const existsAsync = promisify(exists)

const description = "A set of 8 random numbers whose rarity follows a Gaussian distribution. Generated and stored on-chain using the power of the central limit theorem."

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
      attributes: [],
    }

    res.end(JSON.stringify(metadata, null, 2))
  } catch {
    res.status(500).end(JSON.stringify({ error: "Unexpected server error" }))
  }
}
