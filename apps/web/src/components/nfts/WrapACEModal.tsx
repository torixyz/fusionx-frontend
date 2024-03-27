import { useTranslation } from '@pancakeswap/localization'
import { enduranceTokens } from '@pancakeswap/tokens'
import { AceIcon, Button, Flex, InjectedModalProps, Loading, Modal, useModal, useToast } from '@pancakeswap/uikit'
import ArrowDown from '@pancakeswap/uikit/components/Svg/Icons/ArrowDown'
import PriceInput from 'components/PriceInput'
import MakeOfferModal from 'components/nfts/MakeOfferModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useState } from 'react'
import { displayBalance } from 'utils/display'
import { useEthersSigner } from 'utils/ethers'
import { Address, parseEther } from 'viem'
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { WACE } from '@pancakeswap/sdk'

export interface WrapACEModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
  refetch?: any
}
const WrapACEModal = ({ onDismiss, collectionAddress, tokenId, refetch }: WrapACEModalProps) => {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const chainId = useChainId()
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const [showMakeOfferModal] = useModal(
    <MakeOfferModal collectionAddress={collectionAddress} tokenId={tokenId} refetch={refetch} />,
  )
  const { data: balance } = useBalance({
    address,
  })
  const { t } = useTranslation()

  const { config } = usePrepareContractWrite({
    address: WACE[chainId]?.address as Address,
    abi: [
      {
        inputs: [],
        name: 'deposit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'deposit',
    value: parseEther(amount),
    enabled: !!amount,
  })

  const { write: wrap, data: approveTx, isLoading: isPreLoading } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({
    hash: approveTx?.hash,
    onSuccess: () => {
      toastSuccess('Transfer successfully')
      onDismiss?.()
    },
  })

  return (
    <Modal title={t('Wrap ACE')} headerBackground="gradientCardHeader" onDismiss={showMakeOfferModal}>
      <PriceInput
        label="ACE"
        balance={displayBalance(balance?.value)}
        amount={amount}
        setAmount={setAmount}
        errorMsg=""
        suffix={
          <>
            <div className="flex items-center gap-1 bg-[#4a4a4c] rounded-full p-2">
              <AceIcon />
              ACE
            </div>
          </>
        }
      />
      <Flex mt="10px" justifyContent="center">
        <ArrowDown />
      </Flex>
      <PriceInput
        label="WACE"
        amount={amount}
        setAmount={setAmount}
        errorMsg=""
        disabled
        suffix={
          <>
            <div className="flex items-center gap-1 bg-[#4a4a4c] rounded-full p-2">
              <img src={`${ASSET_CDN}/wace.png`} alt="wace" width={18} height={18} />
              WACE
            </div>
          </>
        }
      />
      <Button mt="20px" onClick={wrap} isLoading={isLoading || isPreLoading}>
        {(isLoading || isPreLoading) && <Loading mr="10px" />}
        Wrap
      </Button>
    </Modal>
  )
}

export default WrapACEModal
