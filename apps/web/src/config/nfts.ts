import { ASSET_CDN } from 'config/constants/endpoints'
import { Address } from 'viem'
import { ChainId } from '@pancakeswap/chains'

// export const DOCKMAN_HOST = 'http://copilot.tpddns.cn:19000'
export const DOCKMAN_HOST = {
  [ChainId.ENDURANCE_TESTNET]: 'https://devnetapi.tesseract.world',
  [ChainId.ENDURANCE]: 'https://api.tesseract.world',
}

export const PEAEC_COLLECTION_ID = {
  [ChainId.ENDURANCE]: '648-0xaf8Ef2B180fe7CADe68643705adAe08d1d2791A1',
  // [ChainId.ENDURANCE]: '648-0x0a2d8f259b976147c7d014d337331951ef3c1f4b',
  [ChainId.ENDURANCE_TESTNET]: '6480-0xbc638689c189b31cb4261566a59625c7db7a018a',
}

export const SEAPORT_ADDRESS = {
  [ChainId.ENDURANCE]: '0xFF28baa302C29cFcbe898A10d4AD4f3CA574D02F',
  [ChainId.ENDURANCE_TESTNET]: '0xe6A51926775C88442b8456BCfa6123BC702dc09f',
}

export const FEE_ADDRESS = '0x2E9ACb9B3b95D5BE81EB2C19b79544E4EC1009f7'

export const FEE_BASIS_POINTS = 500

export const DEFAULT_NFT_IMAGE = `${ASSET_CDN}/default-nft.png`
export const DEFAULT_AVATAR = `${ASSET_CDN}/default-avatar.png`
export const DEFAULT_COLLECTION_AVATAR = `${ASSET_CDN}/default-collection-avatar-3.png`
export const DEFAULT_COLLECTION_BANNER = `${ASSET_CDN}/default-collection-banner.png`

export const RECYCLE_CONTRACT_ADDRESS = {
  [ChainId.ENDURANCE]: '0x2E9ACb9B3b95D5BE81EB2C19b79544E4EC1009f7',
  [ChainId.ENDURANCE_TESTNET]: '0x64e1C67C6785ae81b9cf417fD2C0d30d20c51d12',
}

export const RECYCLE_ABI = [
  {
    inputs: [],
    name: 'peekBuybackAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'buyback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
