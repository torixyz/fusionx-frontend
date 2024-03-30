import { Button, ExpandIcon, Flex, IconButton, ShrinkIcon, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { useState } from 'react'
import BasicChart from './BasicChart'
import { StyledIframe, StyledPriceChart } from './styles'

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  isFullWidthContainer,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const [isTokenPrice, setIsTokenPrice] = useState(false)

  return (
    <StyledPriceChart
      height="70%"
      overflow="unset"
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
      marginTop={isTokenPrice ? '0px' : ''}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
          )}
          {inputCurrency && (
            <Text color="text" bold>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
          <IconButton variant="text" onClick={onSwitchTokens}>
            <SyncAltIcon ml="6px" color="primary" />
          </IconButton>
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
      {isTokenPrice ? (
        <Flex justifyContent="space-between" padding="12px" marginTop="-8px">
          <StyledIframe src="https://peace-price.archivenode.club/" width="100%" height="440px" title="price" />
        </Flex>
      ) : (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
      )}
      <Flex px="24px" marginTop={isTokenPrice ? '4px' : '70px'}>
        <Button
          onClick={() => {
            setIsTokenPrice(!isTokenPrice)
          }}
          scale="sm"
          style={{ borderRadius: 4 }}
        >
          {isTokenPrice ? 'Hide Token Price' : 'Token Price'}
          <img src="/images/token-price-icon.png" alt="" width={13} height={16} style={{ marginLeft: 4 }} />
        </Button>
      </Flex>
    </StyledPriceChart>
  )
}

export default PriceChart
