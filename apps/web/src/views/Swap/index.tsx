import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import {
  AutoColumn,
  BottomDrawer,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AppBody } from 'components/App'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { currencyId } from 'utils/currencyId'

import AnalyticPage from 'components/Layout/Page'
import dayjs from 'dayjs'
import { useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import useTheme from 'hooks/useTheme'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import BarChart from 'views/V3Info/components/BarChart/alt'
import { DarkGreyCard } from 'views/V3Info/components/Card'
import LineChart from 'views/V3Info/components/LineChart/alt'
import Percent from 'views/V3Info/components/Percent'
import { RowBetween, RowFixed } from 'views/V3Info/components/Row'
import { ChartCardsContainer, MonoSpace, ProtocolWrapper } from 'views/V3Info/components/shared'
import { useProtocolChartData, useProtocolData } from 'views/V3Info/hooks'
import { useTransformedVolumeData } from 'views/V3Info/hooks/chart'
import { VolumeWindow } from 'views/V3Info/types'
import { getPercentChange } from 'views/V3Info/utils/data'
import { unixToDate } from 'views/V3Info/utils/date'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import Page from '../Page'
import { SwapFeaturesContext } from './SwapFeaturesContext'
import { V3SwapForm } from './V3Swap'
import PriceChartContainer from './components/Chart/PriceChartContainer'
import useWarningImport from './hooks/useWarningImport'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

export default function Swap() {
  const { query } = useRouter()
  const { isDesktop } = useMatchBreakpoints()

  const {
    isChartExpanded,
    isChartDisplayed,
    setIsChartDisplayed,
    setIsChartExpanded,
    isChartSupported,
    isHotTokenSupported,
  } = useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  const { t } = useTranslation()
  const [firstTime, setFirstTime] = useState(true)
  const protocolData = useProtocolData()
  const chartData = useProtocolChartData()
  const { chainId } = useActiveChainId()
  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  const [rightLabel, setRightLabel] = useState<string | undefined>()
  const { theme } = useTheme()
  const now = dayjs()
  const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.daily)
  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')
  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [chainId])

  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
      setLiquidityHover(protocolData.tvlUSD)
    }
  }, [liquidityHover, protocolData])
  useEffect(() => {
    if (firstTime && query.showTradingReward) {
      setFirstTime(false)
      setIsSwapHotTokenDisplay(true)

      if (!isSwapHotTokenDisplay && isChartDisplayed) {
        setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
      }
    }
  }, [firstTime, isChartDisplayed, isSwapHotTokenDisplay, query, setIsSwapHotTokenDisplay, setIsChartDisplayed])

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  const singleTokenPrice = useSingleTokenSwapInfo(
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    isChartSupported,
  )
  const warningSwapHandler = useWarningImport()
  useDefaultsFromURLSearch()
  const { onCurrencySelection } = useSwapActionHandlers()

  const handleOutputSelect = useCallback(
    (newCurrencyOutput: Currency) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )
  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.tvlUSD,
        }
      })
    }
    return []
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  const tvlValue = useMemo(() => {
    return formatDollarAmount(liquidityHover, 2, true)
  }, [liquidityHover])

  return (
    <Page removePadding={isChartExpanded} style={{ padding: 48 }}>
      <Flex
        width={['480px', '100%']}
        maxWidth="100%"
        height="100%"
        justifyContent="center"
        position="relative"
        alignItems="flex-start"
      >
        {isDesktop && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {!isDesktop && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isFullWidthContainer
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={setIsChartDisplayed}
          />
        )}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <V3SwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
      <AnalyticPage style={{ minHeight: 472 }}>
        <Heading scale="lg" mb="16px">
          {t('Analytics')}
        </Heading>
        <ChartCardsContainer>
          <Card>
            <LineChart
              data={formattedTvlData}
              height={220}
              minHeight={332}
              color="#FFCC47"
              value={liquidityHover}
              label={leftLabel}
              setValue={setLiquidityHover}
              setLabel={setLeftLabel}
              topLeft={
                <AutoColumn gap="4px">
                  <Text fontSize="16px">{t('TVL')}</Text>
                  <Text fontSize="32px">
                    <MonoSpace>{tvlValue}</MonoSpace>
                  </Text>
                  <Text fontSize="12px" height="14px">
                    <MonoSpace>{leftLabel ?? now.format('MMM D, YYYY')} (UTC)</MonoSpace>
                  </Text>
                </AutoColumn>
              }
            />
          </Card>
          <Card>
            <BarChart
              height={200}
              minHeight={332}
              data={
                volumeWindow === VolumeWindow.monthly
                  ? monthlyVolumeData
                  : volumeWindow === VolumeWindow.weekly
                  ? weeklyVolumeData
                  : formattedVolumeData
              }
              color="#FFCC47"
              setValue={setVolumeHover}
              setLabel={setRightLabel}
              value={volumeHover}
              label={rightLabel}
              activeWindow={volumeWindow}
              topRight={
                <RowFixed style={{ marginLeft: '-40px', marginTop: '8px' }}>
                  <Button
                    className="bg-black"
                    scale="sm"
                    variant={volumeWindow === VolumeWindow.daily ? 'primary' : 'subtle'}
                    onClick={() => setVolumeWindow(VolumeWindow.daily)}
                  >
                    D
                  </Button>
                  <Button
                    scale="sm"
                    variant={volumeWindow === VolumeWindow.weekly ? 'primary' : 'subtle'}
                    style={{ marginLeft: '8px' }}
                    onClick={() => setVolumeWindow(VolumeWindow.weekly)}
                  >
                    W
                  </Button>
                  <Button
                    variant={volumeWindow === VolumeWindow.monthly ? 'primary' : 'subtle'}
                    scale="sm"
                    style={{ marginLeft: '8px' }}
                    onClick={() => setVolumeWindow(VolumeWindow.monthly)}
                  >
                    M
                  </Button>
                </RowFixed>
              }
              topLeft={
                <AutoColumn gap="4px">
                  <Text fontSize="16px">{t('Volume')}</Text>
                  <Text fontSize="32px">
                    <MonoSpace>
                      {volumeHover
                        ? formatDollarAmount(volumeHover)
                        : formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value, 2)}
                    </MonoSpace>
                  </Text>
                  <Text fontSize="12px" height="14px">
                    <MonoSpace>{rightLabel ?? now.format('MMM D, YYYY')} (UTC)</MonoSpace>
                  </Text>
                </AutoColumn>
              }
            />
          </Card>
        </ChartCardsContainer>
        <ProtocolWrapper>
          <DarkGreyCard>
            <RowBetween>
              <RowFixed>
                <RowFixed mr="20px">
                  <Text mr="4px">{t('Volume 24H')}: </Text>
                  <Text mr="4px">{formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)}</Text>
                  <Percent
                    value={getPercentChange(
                      formattedVolumeData[formattedVolumeData.length - 1]?.value.toString(),
                      formattedVolumeData[formattedVolumeData.length - 2]?.value.toString(),
                    )}
                    wrap
                  />
                </RowFixed>
                <RowFixed mr="20px">
                  <Text mr="4px">{t('Fees 24H')}: </Text>
                  <Text mr="4px">{formatDollarAmount(protocolData?.feesUSD)}</Text>
                  <Percent value={protocolData?.feeChange} wrap />
                </RowFixed>
                <Box>
                  <RowFixed mr="20px">
                    <Text mr="4px">{t('TVL')}: </Text>
                    <Text mr="4px">{formatDollarAmount(protocolData?.tvlUSD)}</Text>
                    <Percent value={protocolData?.tvlUSDChange} wrap />
                  </RowFixed>
                </Box>
              </RowFixed>
            </RowBetween>
          </DarkGreyCard>
        </ProtocolWrapper>
      </AnalyticPage>
    </Page>
  )
}
