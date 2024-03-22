import { styled } from 'styled-components'
import { Card, CardProps } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 12px;
  max-width: 100%;
  width: 480px;
  @media (max-width: 500px) {
    width: 380px;
  }
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...cardProps }: { children: React.ReactNode } & CardProps) {
  return <BodyWrapper {...cardProps}>{children}</BodyWrapper>
}
