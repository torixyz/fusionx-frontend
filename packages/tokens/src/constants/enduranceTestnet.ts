import { ChainId, ERC20Token, WACE } from '@pancakeswap/sdk'

export const enduranceTestnetTokens = {
  wace: WACE[ChainId.ENDURANCE_TESTNET],
  peACE: new ERC20Token(
    ChainId.ENDURANCE_TESTNET,
    '0x3eB5996693ad730006132ed69411dBF30437a6Dd',
    18,
    'PeACE',
    'PrimeACE',
    'https://www.fusionist.io',
  ),
}
