import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { cn } from 'utils/tailwind'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { openConnectModal } = useConnectModal()
  const handleActive = useActiveHandle()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined' && !window.ethereum) {
      handleActive()
      openConnectModal?.()
    } else {
      // setOpen(true)
      openConnectModal?.()
    }
  }

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children || <Trans>Connect Wallet</Trans>}
      </Button>
    </>
  )
}

export default ConnectWalletButton
