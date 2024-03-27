import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { useTranslation } from '@pancakeswap/localization'
import { enduranceTokens } from '@pancakeswap/tokens'
import { Button, Grid, InjectedModalProps, Loading, Modal, useModal, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import PriceInput from 'components/PriceInput'
import WrapACEModal from 'components/nfts/WrapACEModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { DOCKMAN_HOST, FEE_ADDRESS, FEE_BASIS_POINTS, SEAPORT_ADDRESS } from 'config/nfts'
import { useEffect, useState } from 'react'
import { displayBalance } from 'utils/display'
import { useEthersSigner } from 'utils/ethers'
import { Address } from 'viem'
import { erc20ABI, useAccount, useBalance, useChainId, useContractRead } from 'wagmi'
import { WACE } from '@pancakeswap/sdk'

export interface MakeOfferModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
  refetch?: any
}
const MakeOfferModal = ({ collectionAddress, tokenId, onDismiss, refetch }: MakeOfferModalProps) => {
  const chainId = useChainId()
  const [showWrapModal] = useModal(
    <WrapACEModal collectionAddress={collectionAddress} tokenId={tokenId} refetch={refetch} />,
  )
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [buttonStatus, setButtonStatus] = useState(false)
  const { address } = useAccount()
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const { data: balance } = useBalance({
    token: WACE[chainId].address as Address,
    address,
    chainId,
  })

  useEffect(() => {
    const bn = new BigNumber(amount)
    const decimalLength = amount.split('.').length > 1 ? amount.split('.')[1].length : 0
    if (bn.isGreaterThan(999999) || decimalLength > 4) {
      setButtonStatus(true)
    } else {
      setButtonStatus(false)
    }
  }, [amount])
  const { data: allowance } = useContractRead({
    address: WACE[chainId].address as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as Address, SEAPORT_ADDRESS[chainId]],
    watch: true,
    enabled: !!address,
  })

  const onMakeOffer = async () => {
    if (!signer) return
    setLoading(true)
    try {
      // @ts-ignore
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS[chainId] },
      })

      const takerOrder = {
        zone: '0x0000000000000000000000000000000000000000',
        startTime: Math.floor(new Date().getTime() / 1000).toString(),
        endTime: Math.floor(new Date().getTime() / 1000 + 2 * 30 * 24 * 60 * 60).toString(),
        offer: [
          {
            amount: new BigNumber(amount)
              .multipliedBy(100)
              .multipliedBy(10 ** 16)
              .toFixed(),
            endAmount: new BigNumber(amount)
              .multipliedBy(100)
              .multipliedBy(10 ** 16)
              .toFixed(),
            token: WACE[chainId].address,
            itemType: ItemType.ERC20,
            identifier: '0',
          },
        ],
        consideration: [
          {
            itemType: ItemType.ERC721,
            token: collectionAddress,
            identifier: tokenId,
            amount: '1',
            recipient: address,
          },
        ],
        fees: [{ recipient: FEE_ADDRESS, basisPoints: FEE_BASIS_POINTS }],
      }

      // const contract = new Contract(enduranceTokens.wace.address, erc20ABI, signer)
      // const tx = await contract?.approve(SEAPORT_ADDRESS, ethers.constants.MaxUint256)
      // await tx?.wait()

      const { executeAllActions } = await seaport.createOrder(takerOrder, address)
      const order = await executeAllActions()

      const res = await fetch(`${DOCKMAN_HOST[chainId]}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order,
          chain_id: chainId?.toString(),
        }),
      }).then((r) => r.json())
      if (res?.errorCode) {
        toastError(res?.message)
        setLoading(false)
        return
      }
      onDismiss?.()
      refetch?.()
      setTimeout(() => toastSuccess('Make offer successfully'), 1500)
    } catch (e: any) {
      toastError(e.toString())
    }

    setLoading(false)
  }

  const { t } = useTranslation()

  return (
    <Modal title={t('Make Offer')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <PriceInput
        label="Offer Price"
        balance={displayBalance(balance?.value)}
        amount={amount}
        setAmount={setAmount}
        errorMsg=""
        suffix={
          <>
            <div className="flex items-center gap-1 bg-[#4a4a4c] rounded-full p-2">
              <img src={`${ASSET_CDN}/wace.png`} alt="wace" width={18} height={18} />
              WACE
            </div>
          </>
        }
        max={999999}
        decimal={4}
      />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="12px">
        <Button mt="20px" onClick={onMakeOffer} isLoading={loading} disabled={buttonStatus}>
          {loading && <Loading mr="10px" />}
          Confirm
        </Button>
        <Button mt="20px" onClick={showWrapModal}>
          Add WACE
        </Button>
      </Grid>
    </Modal>
  )
}

export default MakeOfferModal
