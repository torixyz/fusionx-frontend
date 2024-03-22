import { Token } from '@pancakeswap/sdk'
import { TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { multiChainId, MultiChainName } from 'state/info/constant'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'
import { ASSET_CDN } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/chains'
import getTokenLogoURL from '../../../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: #faf9fa;
  color: ${({ theme }) => theme.colors.text};
`

export const CurrencyLogo: React.FC<
  React.PropsWithChildren<{
    address?: string
    token?: Token
    size?: string
    chainName?: MultiChainName
  }>
> = ({ address, size = '24px', token, chainName = 'BSC', ...rest }) => {
  const src = useMemo(() => {
    return getTokenLogoURL(new Token(multiChainId[chainName], address as Address, 18, token?.symbol ?? ''))
  }, [address, chainName])

  const srcFromPCS = `${ASSET_CDN}/${token?.symbol.toLowerCase()}.png`
  return <StyledLogo size={size} srcs={[srcFromPCS, src ?? '']} alt="token logo" useFilledIcon {...rest} />
}

const DoubleCurrencyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 32px;
`

interface DoubleCurrencyLogoProps {
  address0?: string
  address1?: string
  size?: number
  chainName?: MultiChainName
  token0?: Token
  token1?: Token
}

export const DoubleCurrencyLogo: React.FC<React.PropsWithChildren<DoubleCurrencyLogoProps>> = ({
  address0,
  address1,
  token0,
  token1,
  size = 16,
  chainName = 'BSC',
}) => {
  return (
    <DoubleCurrencyWrapper>
      {address0 && (
        <CurrencyLogo
          token={
            new Token(
              ChainId.ENDURANCE,
              token0?.address ?? `0x{string}`,
              token0?.decimals ?? 18,
              token0?.symbol ?? '',
              token0?.name,
              '',
            )
          }
          address={address0}
          size={`${size.toString()}px`}
          chainName={chainName}
        />
      )}
      {address1 && (
        <CurrencyLogo
          token={
            new Token(
              ChainId.ENDURANCE,
              token1?.address ?? `0x{string}`,
              token0?.decimals ?? 18,
              token1?.symbol ?? '',
              token1?.name,
              '',
            )
          }
          address={address1}
          size={`${size.toString()}px`}
          chainName={chainName}
        />
      )}
    </DoubleCurrencyWrapper>
  )
}
