import { ChainId, endurance, enduranceTestnet, getV3Subgraphs } from '@pancakeswap/chains'
import { OnChainProvider, SubgraphProvider } from '@pancakeswap/smart-router/evm'
import { createPublicClient, http } from 'viem'
import { GraphQLClient } from 'graphql-request'
import { SupportedChainId } from './constants'

const requireCheck = [ENDURANCE_NODE]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const V3_SUBGRAPHS = getV3Subgraphs({
  noderealApiKey: '',
})

const enduranceClient = createPublicClient({
  chain: endurance,
  transport: http(ENDURANCE_NODE),
})

const enduranceTestnetClient = createPublicClient({
  chain: enduranceTestnet,
  transport: http(ENDURANCE_TESTNET_NODE),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.ENDURANCE:
      return enduranceClient
    case ChainId.ENDURANCE_TESTNET:
      return enduranceTestnetClient
    default:
      return enduranceClient
  }
}

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.ENDURANCE]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ENDURANCE], { fetch }),
} as const

export const v3SubgraphProvider: SubgraphProvider = ({ chainId = ChainId.ENDURANCE }: { chainId?: ChainId }) => {
  return v3SubgraphClients[chainId as SupportedChainId] || v3SubgraphClients[ChainId.ENDURANCE]
}
