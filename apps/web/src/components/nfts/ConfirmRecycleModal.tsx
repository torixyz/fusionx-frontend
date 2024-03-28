import { useTranslation } from '@pancakeswap/localization'
import { AceIcon, Button, InjectedModalProps, Loading, Modal, Row, Text, useToast } from '@pancakeswap/uikit'
import { RECYCLE_ABI, RECYCLE_CONTRACT_ADDRESS } from 'config/nfts'
import { displayBalance } from 'utils/display'
import { Address } from 'viem'
import {
  erc721ABI,
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export interface ListModalProps extends InjectedModalProps {
  contract: Address
  tokenId: string
  refetch?: any
}
const ConfirmRecycleModal = ({ contract, tokenId, onDismiss, refetch }: ListModalProps) => {
  const { toastSuccess } = useToast()
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: buybackAmount } = useContractRead({
    address: RECYCLE_CONTRACT_ADDRESS[chainId] as Address,
    abi: RECYCLE_ABI,
    functionName: 'peekBuybackAmount',
    watch: true,
  })

  const { data: isApproved } = useContractRead({
    address: contract,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address as Address, RECYCLE_CONTRACT_ADDRESS[chainId] as Address],
    watch: true,
  })

  const { config } = usePrepareContractWrite({
    address: RECYCLE_CONTRACT_ADDRESS[chainId] as Address,
    abi: RECYCLE_ABI,
    functionName: 'buyback',
    args: [tokenId],
    enabled: isApproved,
  })

  const { write, data: tx, isLoading: isPreLoading } = useContractWrite(config)
  const { isLoading } = useWaitForTransaction({ hash: tx?.hash })

  const { config: approveConfig } = usePrepareContractWrite({
    address: contract,
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [RECYCLE_CONTRACT_ADDRESS[chainId] as Address, true],
  })

  const { write: approve, data: approveTx, isLoading: isApprovePreLoading } = useContractWrite(approveConfig)
  const { isLoading: isApproveLoading } = useWaitForTransaction({
    hash: approveTx?.hash,
    onSuccess: () => {
      toastSuccess('Recycle successfully')
      onDismiss?.()
    },
  })

  const { t } = useTranslation()

  return (
    <Modal title={t('Recycle')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <Text mb="10px" fontSize="16px">
        You can receive
      </Text>
      <Row gap="8px" fontSize="14px">
        {displayBalance(buybackAmount, 18, 6)}
        <AceIcon />
      </Row>
      {!isApproved ? (
        <Button onClick={approve} mt="20px" isLoading={isApproveLoading || isApprovePreLoading}>
          {(isApproveLoading || isApprovePreLoading) && <Loading mr="10px" />}
          Approve
        </Button>
      ) : (
        <Button onClick={write} mt="20px" isLoading={isLoading || isPreLoading}>
          {(isLoading || isPreLoading) && <Loading mr="10px" />}
          Confirm
        </Button>
      )}
    </Modal>
  )
}

export default ConfirmRecycleModal
