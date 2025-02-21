/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import {
  AceIcon,
  ArrowBackIcon,
  AutoRow,
  Box,
  Button,
  Card,
  Column,
  Container,
  Flex,
  IconButton,
  Loading,
  Row,
  Text,
} from '@pancakeswap/uikit'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  DEFAULT_COLLECTION_AVATAR,
  DEFAULT_NFT_IMAGE,
  DOCKMAN_HOST,
  RECYCLE_ABI,
  RECYCLE_CONTRACT_ADDRESS,
} from 'config/nfts'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { styled } from 'styled-components'
import { ellipseAddress } from 'utils/address'
import { displayBalance } from 'utils/display'
import { useBalance, useChainId, useContractRead } from 'wagmi'
import Image from '../../../components/nfts/component/image'
import AddressLink from '../../../components/nfts/component/link'

const NFTImage = styled.img`
  border: 1px solid #fff;
  border-radius: 4px;
`

const SortButtonWrapper = styled.div`
  .sensei__arrow-box {
    box-sizing: border-box;
    padding: 2px 0;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .sensei__arrow {
    width: 5px;
    height: 5px;
    box-sizing: border-box;
    border-color: rgba(255, 255, 255, 0.3);
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-radius: 1px;
    transform-origin: center;
  }
  .sensei__arrow-up {
    transform: rotate(-135deg);
  }
  .sensei__arrow-down {
    transform: rotate(45deg);
  }
  .sensei__arrow--active {
    border-color: rgba(255, 255, 255, 0.95);
  }
`
const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 30px;
  border-radius: 8px;

  &:hover {
    background: #212121;
  }
`
const ItemsWrapper = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
`

type ISortButton = {
  type: 'asc' | 'desc' | 'none'
  onClickAsc: () => void
  onClickDesc: () => void
}

const SortButton = ({ type, onClickAsc, onClickDesc }: ISortButton) => {
  const upClassName = type === 'asc' ? 'sensei__arrow--active' : ''
  const downClassName = type === 'desc' ? 'sensei__arrow--active' : ''
  return (
    <SortButtonWrapper>
      <div className="sensei__arrow-box">
        <div className={`sensei__arrow sensei__arrow-up ${upClassName}`} onClick={onClickAsc} />
        <div className={`sensei__arrow sensei__arrow-down ${downClassName}`} onClick={onClickDesc} />
      </div>
    </SortButtonWrapper>
  )
}

export default function SGTList() {
  const router = useRouter()
  const { id } = router.query
  const chainId = useChainId()

  const { data: collection } = useQuery({
    queryKey: ['collectionDetail', id],
    queryFn: () => {
      return fetch(`${DOCKMAN_HOST[chainId]}/collection/detail?id=${id}`).then((r) => r.json())
    },
    enabled: !!id,
  })
  console.log(collection)

  const _columns = [
    {
      name: 'NFT',
      sortType: 'none',
      style: {
        width: '180px',
        justifyContent: 'flex-start',
      },
    },
    {
      name: 'Rarity',
      sortType: 'none',
      style: {
        width: '120px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Price',
      sortType: 'asc',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Last Sale',
      sortType: 'none',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },

    {
      name: 'Top BID',
      sortType: 'none',
      style: {
        width: '150px',
        justifyContent: 'center',
      },
    },
    {
      name: 'Owner',
      sortType: 'none',
      style: {
        width: '180px',
        justifyContent: 'center',
      },
    },
    {
      name: '',
      sortType: 'none',
      style: {
        paddingLeft: '32px',
        flex: '1',
        justifyContent: 'center',
      },
    },
  ]

  const [columns, setColumns] = useState(_columns)
  const sortKey = columns.find((column) => {
    return column.sortType !== 'none'
  })

  let querySortType = ''
  switch (sortKey?.name) {
    case 'Price':
      querySortType = sortKey.sortType === 'asc' ? 'price_increase' : 'price_decrease'
      break
    case 'Rarity':
      querySortType = sortKey.sortType === 'asc' ? 'rarity_increase' : 'rarity_decrease'
      break
    default:
      break
  }

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: [`nfts_${id}_${querySortType}`],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${DOCKMAN_HOST[chainId]}/nft?page_number=${
          pageParam + 1
        }&page_size=20&collection_id=${id}&sort_type=${querySortType}`,
      ).then((r) => r.json())

      if (res?.statusCode === 500) {
        throw new Error(res?.message)
      }

      return res
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.meta?.currentPage
    },
    initialPageParam: 0,
    enabled: !!id,
  })

  const pages = data?.pages
  const nfts = pages?.reduce((results: any[], ci: any) => {
    results.push(...ci.data)
    return results
  }, [])
  const meta = pages?.[pages?.length - 1]?.meta

  const { data: recyclePoolBalance } = useBalance({
    address: RECYCLE_CONTRACT_ADDRESS[chainId],
  })
  const { data: buybackAmount } = useContractRead({
    address: RECYCLE_CONTRACT_ADDRESS[chainId],
    abi: RECYCLE_ABI,
    functionName: 'peekBuybackAmount',
    watch: true,
  })

  if (!nfts || !collection) {
    return (
      <Flex alignItems="center" justifyContent="center" py="40px">
        <Loading color="primary" width="30px" height="30px" />
      </Flex>
    )
  }

  return (
    <InfiniteScroll
      dataLength={nfts?.length ?? 0}
      hasMore={!meta?.isLastPage}
      loader={
        <Flex alignItems="center" justifyContent="center" py={4}>
          <Loading />
        </Flex>
      }
      next={fetchNextPage}
      style={{ overflow: 'hidden' }}
    >
      <Container>
        <Box pt="20px" pb="40px">
          <div className="nft-list__wrapper">
            <Link href="/nfts" style={{ position: 'absolute', top: 20, left: 50 }}>
              <IconButton as="a" scale="sm">
                <ArrowBackIcon width="32px" />
              </IconButton>
            </Link>
            <Card p="20px" mb="20px">
              <Row alignItems="center">
                <Flex mr="30px">
                  <Box width="80px" ml="5px">
                    <Image
                      src={collection?.collection_avatar ?? DEFAULT_COLLECTION_AVATAR}
                      alt="avatar"
                      style={{ width: '80px', height: '80px', border: '1px solid #fff', borderRadius: 4 }}
                    />
                  </Box>
                  <Box ml="10px" mr="30px" mt="20px">
                    <Text fontSize="18px">{collection?.collection_name}</Text>
                  </Box>
                </Flex>
                <AutoRow>
                  <Box width="120px">
                    <Text color="textSubtle" mb="2px">
                      Floor Price
                    </Text>
                    <AutoRow gap="8px">
                      <Text>{displayBalance(collection?.collection_floor_price)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  <Box width="120px">
                    <Text color="textSubtle" mb="2px">
                      Top BID
                    </Text>
                    <AutoRow gap="8px">
                      <Text>{displayBalance(collection?.collection_top_bid)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  <Box width="140px">
                    <Text color="textSubtle" mb="2px">
                      Recycle Price
                    </Text>
                    <AutoRow gap="8px">
                      <Text>{displayBalance(buybackAmount, 18, 6)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  <Box width="140px">
                    <Text color="textSubtle" mb="2px">
                      Recycle Pool
                    </Text>
                    <AutoRow gap="8px">
                      <Text>{displayBalance(recyclePoolBalance?.value)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  <Box width="120px">
                    <Text color="textSubtle" mb="2px">
                      1D Volume
                    </Text>
                    <AutoRow gap="8px">
                      <Text>{displayBalance(collection?.one_day_volume)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  {/* <Box>
                    <Text color="textSubtle" mb="2px">
                      3D Volume
                    </Text>
                    <AutoRow gap="4px">
                      <Text>{displayBalance(collection?.three_day_volume)}</Text>
                      <AceIcon />
                    </AutoRow>
                  </Box> */}
                  <Box width="100px">
                    <Text color="textSubtle" mb="2px">
                      Supply
                    </Text>
                    <Text>{collection?.supply}</Text>
                  </Box>
                  <Box width="100px">
                    <Text color="textSubtle" mb="2px">
                      Owners
                    </Text>
                    <Text>{collection?.collection_owners}</Text>
                  </Box>
                </AutoRow>
              </Row>
            </Card>
            <ItemsWrapper>
              <Column alignItems="center">
                <div className="sensei__table-header" style={{ width: '100%', padding: '0 30px' }}>
                  {columns.map((item, index) => {
                    return (
                      <div key={item.name} style={item.style} className="sensei__table-header-item">
                        {item.name}
                        {['Rarity', 'Price'].includes(item.name) && (
                          <SortButton
                            type={item.sortType as 'asc' | 'desc' | 'none'}
                            onClickAsc={() => {
                              const newColumns = [...columns]
                              newColumns.map((column) => {
                                // eslint-disable-next-line no-param-reassign
                                column.sortType = 'none'
                                return column
                              })
                              newColumns[index].sortType = 'asc'
                              setColumns([...newColumns])
                            }}
                            onClickDesc={() => {
                              const newColumns = [...columns]
                              newColumns.map((column) => {
                                // eslint-disable-next-line no-param-reassign
                                column.sortType = 'none'
                                return column
                              })
                              newColumns[index].sortType = 'desc'
                              setColumns([...newColumns])
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <Column style={{ marginTop: '20px', gap: '8px', width: '100%' }}>
                  {nfts?.map((nft: any) => {
                    return (
                      <ItemLink
                        href={`/nfts/detail/${nft?.id}`}
                        key={nft?.id}
                        style={{
                          filter:
                            nft?.owner === '0x0000000000000000000000000000000000000000' ? 'brightness(0.8)' : 'none',
                        }}
                      >
                        <Flex flexShrink={0} alignItems="center" width="180px">
                          <Image
                            width={60}
                            height={60}
                            src={nft?.nft_image ? nft?.nft_image : DEFAULT_NFT_IMAGE}
                            alt="avatar"
                            style={{ border: '1px solid #fff', borderRadius: 4 }}
                          />
                          <Text fontSize="13px" ml="10px">
                            {nft?.nft_name ? nft?.nft_name : `#${nft?.token_id}`}
                          </Text>
                        </Flex>
                        <Box width="120px" style={{ textAlign: 'center', flexShrink: 0 }}>
                          {nft.rarity}
                        </Box>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          width="150px"
                          style={{ gap: '8px' }}
                        >
                          {nft?.price ? (
                            <>
                              {displayBalance(nft?.price)}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          width="150px"
                          flexShrink={0}
                          style={{ gap: '8px' }}
                        >
                          {nft.last_sale_price ? (
                            <>
                              {displayBalance(nft.last_sale_price ?? 0)}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          width="150px"
                          flexShrink={0}
                          style={{ gap: '8px' }}
                        >
                          {nft.top_bid ? (
                            <>
                              {displayBalance(nft.top_bid ?? 0)}
                              <AceIcon />
                            </>
                          ) : (
                            '-'
                          )}
                        </Flex>
                        <Flex justifyContent="center" width="180px" flexShrink={0}>
                          <AddressLink
                            href={`https://explorer-endurance.fusionist.io/address/${nft.owner}`}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            target="_blank"
                          >
                            {ellipseAddress(nft.owner, 5)}
                          </AddressLink>
                        </Flex>
                        <Row justifyContent="flex-end">
                          <Button scale="sm" onClick={() => router.push(`/nfts/detail/${nft?.id}`)}>
                            Trade
                          </Button>
                        </Row>
                      </ItemLink>
                    )
                  })}
                </Column>
              </Column>
            </ItemsWrapper>
          </div>
        </Box>
      </Container>
    </InfiniteScroll>
  )
}
