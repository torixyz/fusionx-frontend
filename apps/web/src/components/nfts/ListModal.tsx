import { Seaport } from '@opensea/seaport-js'
import { ItemType } from '@opensea/seaport-js/lib/constants'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Loading, Modal, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import PriceInput from 'components/PriceInput'
import TokenSelect from 'components/TokenSelect'
import { DOCKMAN_HOST, FEE_ADDRESS, FEE_BASIS_POINTS, SEAPORT_ADDRESS } from 'config/nfts'
import { useEffect, useState } from 'react'
import { displayBalance } from 'utils/display'
import { useEthersSigner } from 'utils/ethers'
import { parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'

export interface ListModalProps extends InjectedModalProps {
  collectionAddress: string
  tokenId: string
  mode?: string
  refetch?: any
}
const ListModal = ({ collectionAddress, tokenId, onDismiss, refetch }: ListModalProps) => {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const [buttonStatus, setButtonStatus] = useState(false)
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  const { data: balance } = useBalance({
    address,
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
  const onList = async () => {
    if (!signer) return
    setLoading(true)

    try {
      // @ts-ignore
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const makerOrder = {
        zone: '0x0000000000000000000000000000000000000000',
        startTime: Math.floor(new Date().getTime() / 1000).toString(),
        endTime: Math.floor(new Date().getTime() / 1000 + 2 * 30 * 24 * 60 * 60).toString(),
        offer: [
          {
            itemType: ItemType.ERC721,
            token: collectionAddress,
            identifier: tokenId,
            amount: '1',
          },
        ],
        consideration: [
          {
            amount: parseEther(amount).toString(),
            endAmount: parseEther(amount).toString(),
            recipient: address,
          },
        ],
        fees: [{ recipient: FEE_ADDRESS, basisPoints: FEE_BASIS_POINTS }],
      }
      const { executeAllActions } = await seaport.createOrder(makerOrder, address)
      const order = await executeAllActions()

      const res: any = await fetch(`${DOCKMAN_HOST}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order,
          chain_id: '648',
        }),
      }).then((r) => r.json())
      if (res?.errorCode) {
        onDismiss?.()
        toastError(res?.message)
        return
      }
      toastSuccess('List successfully')
      onDismiss?.()
      refetch?.()
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const { t } = useTranslation()

  return (
    <Modal title={t('List')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <PriceInput
        label="Listing Price"
        balance={displayBalance(balance?.value)}
        amount={amount}
        setAmount={setAmount}
        errorMsg=""
        suffix={<TokenSelect />}
        max={999999}
        decimal={4}
      />
      <Flex justifyContent="space-between" py="10px">
        <div>Collection Fee</div>
        <div>5%</div>
      </Flex>
      {/* <Flex justifyContent="space-between" py="10px"> */}
      {/*  <div className="sgt-adventure__modal-total-label">Total received</div> */}
      {/*  <div className="sgt-adventure__modal-total-value">0.95 ACE</div> */}
      {/* </Flex> */}
      <Button onClick={onList} mt="20px" isLoading={loading} disabled={buttonStatus}>
        {loading && <Loading mr="10px" />}
        Confirm
      </Button>
    </Modal>
  )
}

export default ListModal
