import {
  ArrowBackIcon,
  AutoRow,
  Flex,
  Heading,
  IconButton,
  NotificationDot,
  QuestionHelper,
  Text,
} from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import { css, styled } from 'styled-components'
import { SettingsMode } from '../Menu/GlobalSettings/types'

interface Props {
  title: string | React.ReactNode
  subtitle?: string
  helper?: string
  backTo?: string | (() => void)
  noConfig?: boolean
  IconSlot?: React.ReactNode
  buttons?: React.ReactNode
  filter?: React.ReactNode
  shouldCenter?: boolean
  borderHidden?: boolean
}

const AppHeaderContainer = styled(Flex)<{ borderHidden?: boolean }>`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;

  ${({ borderHidden }) =>
    borderHidden &&
    css`
      border-bottom: 1px solid transparent;
    `}
`

const FilterSection = styled(AutoRow)`
  margin-top: 16px;
`

const AppHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  subtitle,
  helper,
  backTo,
  noConfig = false,
  IconSlot = null,
  buttons,
  filter,
  shouldCenter = false,
  borderHidden = false,
}) => {
  const [expertMode] = useExpertMode()

  return (
    <AppHeaderContainer borderHidden={borderHidden}>
      <Flex alignItems="center" width="100%" style={{ gap: '16px' }}>
        {backTo &&
          (typeof backTo === 'string' ? (
            <Link legacyBehavior passHref href={backTo}>
              <IconButton as="a" scale="sm">
                <ArrowBackIcon width="32px" />
              </IconButton>
            </Link>
          ) : (
            <IconButton scale="sm" variant="text" onClick={backTo}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          ))}
        <Flex pr={backTo && shouldCenter ? '48px' : ''} flexDirection="column" width="100%" marginTop="4px">
          <Flex mb="8px" alignItems="center" flexWrap="wrap" justifyContent="space-between" style={{ gap: '16px' }}>
            <Flex flex={1} justifyContent={shouldCenter ? 'center' : ''}>
              {typeof title === 'string' ? <Heading as="h2">{title}</Heading> : title}
              {helper && <QuestionHelper text={helper} ml="4px" placement="top" />}
            </Flex>
            {!noConfig && (
              <Flex alignItems="flex-end">
                <NotificationDot show={expertMode}>
                  <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} />
                </NotificationDot>
                {IconSlot}
              </Flex>
            )}
            {noConfig && buttons && (
              <Flex alignItems="center" mr="16px">
                {buttons}
              </Flex>
            )}
            {noConfig && IconSlot && <Flex alignItems="center">{IconSlot}</Flex>}
          </Flex>
          {subtitle && (
            <Flex alignItems="center" justifyContent={shouldCenter ? 'center' : ''}>
              <Text textAlign={shouldCenter ? 'center' : 'inherit'} color="textSubtle" fontSize="14px">
                {subtitle}
              </Text>
            </Flex>
          )}
          {filter && <FilterSection justifyContent="flex-end">{filter}</FilterSection>}
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
