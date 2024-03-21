import { Seaport } from '@opensea/seaport-js'
import { AceIcon, Box, Button, Column, Loading, useToast } from '@pancakeswap/uikit'
import { DOCKMAN_HOST, SEAPORT_ADDRESS } from 'config/nfts'
import { useState } from 'react'
import { ellipseAddress } from 'utils/address'
import { displayBalance } from 'utils/display'
import { useEthersSigner } from 'utils/ethers'
import { sleep } from 'utils/sleep'
import { useAccount } from 'wagmi'
import AddressLink from './link'
import { Wrapper } from './offer.style'

const Item = ({ columns, offer, isOwner, refetch }: { columns: any; offer: any; isOwner: boolean; refetch?: any }) => {
  const [loading, setLoading] = useState(false)
  const signer = useEthersSigner()
  const { toastSuccess } = useToast()
  const onAccept = async (orderHash: string) => {
    if (!signer) return
    setLoading(true)
    try {
      console.log(offer)
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const order = offer?.order
      console.log(offer)

      const tx = await seaport.fulfillOrder({
        order,
      })
      //  tips: [
      //           {
      //             token: enduranceTokens.wace.address,
      //             amount: new BigNumber(offer.price).multipliedBy(5).div(100).toFixed(),
      //             endAmount: new BigNumber(offer.price).multipliedBy(5).div(100).toFixed(),
      //             recipient: FEE_ADDRESS,
      //           },
      //         ],
      const res = await tx.executeAllActions()

      for (let i = 0; i < 20; i++) {
        // eslint-disable-next-line no-await-in-loop
        const orderRes = await fetch(`${DOCKMAN_HOST}/orders/status?order_hash=${orderHash}`).then((r) => r.json())
        // eslint-disable-next-line no-await-in-loop
        await sleep(2000)
        if (orderRes?.order_status !== 'Normal') {
          break
        }
      }
      toastSuccess('Purchase successfully')
      refetch?.()
    } catch (e: any) {
      console.error(e.toString())
    }

    setLoading(false)
  }
  return (
    <div className="sensei__table-body-tr" key={offer?.id}>
      <div style={{ ...columns[0].style, ...(columns[0].tdStyle || {}) }} className="sensei__table-body-td">
        {displayBalance(offer.price)}
        <AceIcon style={{ marginLeft: 8 }} />
      </div>
      <div style={{ ...columns[1].style, ...(columns[1].tdStyle || {}) }} className="sensei__table-body-td">
        {offer.quantity}
      </div>
      <div style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }} className="sensei__table-body-td">
        <AddressLink href={`https://explorer-endurance.fusionist.io/address/${offer.from}`}>
          {ellipseAddress(offer.from)}
        </AddressLink>
      </div>

      {isOwner && (
        <Button scale="sm" onClick={() => onAccept(offer?.order_hash)} isLoading={loading}>
          {loading && <Loading />}
          Accept
        </Button>
      )}
    </div>
  )
}

export default function Offer({ offers, nft, refetch }: { offers: any; nft: any; refetch?: any }) {
  const { address } = useAccount()
  const isOwner = address?.toLocaleLowerCase() === nft?.owner

  const columns = [
    {
      name: 'Price',
      style: {
        width: '120px',
      },
      tdStyle: {
        color: 'rgba(249, 143, 18, 1)',
        fontWeight: '700',
      },
    },
    {
      name: 'Quantity',
      style: {
        width: '120px',
      },
      tdStyle: {
        paddingLeft: '4px',
      },
    },
    {
      name: 'From',
      style: {
        width: '140px',
      },
    },
    {
      name: '',
      style: {
        paddingLeft: '32px',
        flex: '1',
      },
    },
  ]

  return (
    <Wrapper>
      <div className="sgt-offer__wrapper">
        <div className="sensei__table">
          <div className="sensei__table-header">
            {columns.map((item, index) => {
              return (
                <div key={item.name} style={item.style} className="sensei__table-header-item">
                  {item.name}
                </div>
              )
            })}
          </div>
          <Box maxHeight="160px">
            <Column gap="2px">
              {offers?.map((offer, index) => {
                return <Item columns={columns} offer={offer} isOwner={isOwner} key={offer?.id} refetch={refetch} />
              })}
              {!offers.length ? <span className="sensei__table-no-data">No Data</span> : ''}
            </Column>
          </Box>
        </div>
      </div>
    </Wrapper>
  )
}
