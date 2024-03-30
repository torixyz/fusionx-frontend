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
      {isTokenPrice ? (
        <Flex justifyContent="space-between" padding="0px" marginTop="-8px">
          <StyledIframe src="https://peace-price.archivenode.club/" width="100%" height={440} title="price" />
        </Flex>
      ) : (
        <div>
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
          <BasicChart
            token0Address={token0Address}
            token1Address={token1Address}
            isChartExpanded={isChartExpanded}
            inputCurrency={inputCurrency}
            outputCurrency={outputCurrency}
            isMobile={isMobile}
            currentSwapPrice={currentSwapPrice}
          />
        </div>
      )}
      <Flex px="24px" marginTop="12px">
        <Button
          onClick={() => {
            setIsTokenPrice(!isTokenPrice)
          }}
        >
          {isTokenPrice ? 'Hide Token Price' : 'Token Price'}
        </Button>
      </Flex>
    </StyledPriceChart>
  )
}

export default PriceChart
