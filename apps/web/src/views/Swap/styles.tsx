import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 16px;
`

export const StyledInputCurrencyWrapper = styled(Box)`
  max-width: 100%;
  width: 480px;
  @media (max-width: 500px) {
    width: 380px;
  }
`
