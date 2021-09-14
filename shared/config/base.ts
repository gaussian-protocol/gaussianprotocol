import { DateTime } from "luxon"

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
export const PUBLIC_SALE_TIMESTAMP = parseInt(process.env.NEXT_PUBLIC_PUBLIC_SALE_TIMESTAMP!) ?? 1631905236353

export const PUBLIC_SALE_DATETIME = DateTime.fromMillis(1631905236353)

export const DISCORD_INVITE_LINK = "https://discord.gg/R2eF6sfP"
export const TWITTER_HANDLE = "GaussianProto"
