import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAINS = [ChainId.ENDURANCE, ChainId.ENDURANCE_TESTNET] as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]
