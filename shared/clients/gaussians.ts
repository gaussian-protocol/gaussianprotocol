import { gql, GraphQLClient } from "graphql-request"
import { getGaussianGraphUrl } from "../../src/utils/network"

export type SubgraphGaussian = {
  id: string
  numericId: number
  owner: string
  name: string
  first: number
  second: number
  third: number
  fourth: number
  fifth: number
  sixth: number
  seventh: number
  eighth: number
  numbers: Array<number>
  imageURI: string
}

const GAUSSIAN_FRAGMENT = `
  id
  numericId
  owner
  name
  first
  second
  third
  fourth
  fifth
  sixth
  seventh
  eighth
  numbers
  imageURI
`

type GetGaussianResponse = {
  gaussian: SubgraphGaussian
}

export async function getGaussianById(tokenId: number): Promise<SubgraphGaussian | undefined> {
  const query = gql`
      query getGaussianById($tokenId: Int!) {
          gaussian(id: $tokenId) {
              ${GAUSSIAN_FRAGMENT}
          }
      }
  `
  const variables = {
    tokenId,
  }
  const client = new GraphQLClient(getGaussianGraphUrl())
  const data = await client.request<GetGaussianResponse>(query, variables)
  return data?.gaussian
}

type ListGaussiansResponse = {
  gaussians: Array<SubgraphGaussian>
}

export async function getGaussiansByOwner(walletAddress: string): Promise<Array<SubgraphGaussian>> {
  const query = gql`
      query getGaussiansByOwner($owner: String!) {
          gaussians(where: { owner: $owner }) {
              ${GAUSSIAN_FRAGMENT}
          }
      }
  `
  const variables = {
    owner: walletAddress,
  }
  const client = new GraphQLClient(getGaussianGraphUrl())
  const data = await client.request<ListGaussiansResponse>(query, variables)
  return data?.gaussians ?? []
}
