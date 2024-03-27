import { defineChain } from 'viem'

export const endurance = defineChain({
  id: 648,
  name: 'Endurance',
  network: 'endurance',
  nativeCurrency: {
    decimals: 18,
    name: 'ACE',
    symbol: 'ACE',
  },
  rpcUrls: {
    default: { http: ['https://rpc-endurance.fusionist.io'] },
    public: { http: ['https://rpc-endurance.fusionist.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'EnduranceScan', url: 'https://explorer-endurance.fusionist.io' },
    default: { name: 'EnduranceScan', url: 'https://explorer-endurance.fusionist.io' },
  },
  contracts: {
    multicall3: {
      address: '0xecEb7Ee56dC35144610fd8616257a258C7A1Dcdc',
      blockCreated: 38181,
    },
  },
  testnet: false,
})

export const enduranceTestnet = defineChain({
  id: 6480,
  name: 'EnduranceTestnet',
  network: 'enduranceTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ACE',
    symbol: 'ACE',
  },
  rpcUrls: {
    default: { http: ['https://abcdefg-myrpctestnet.fusionist.io'] },
    public: { http: ['https://abcdefg-myrpctestnet.fusionist.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'EnduranceScan', url: 'https://abcdefg-myexplorertestnet.fusionist.io' },
    default: { name: 'EnduranceScan', url: 'https://abcdefg-myexplorertestnet.fusionist.io' },
  },
  contracts: {
    multicall3: {
      address: '0x64e9e59cBd418C45bC1E225b302da51f0EcFd767',
      blockCreated: 103338,
    },
  },
  testnet: false,
})
