import type { NextApiRequest, NextApiResponse } from "next"
import { getAllGaussians } from "../shared/clients/gaussians"
import { forceRefreshMetadata } from "../shared/clients/opensea"
import { sleep } from "../shared/utils/async"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const gaussians = await getAllGaussians()

  for (const gaussian of gaussians) {
    await forceRefreshMetadata(gaussian.id)
    console.log("Sleeping for 0.3 seconds")
    await sleep(500)
  }

  res.end(JSON.stringify({
    success: true,
  }, null, 2))
}
