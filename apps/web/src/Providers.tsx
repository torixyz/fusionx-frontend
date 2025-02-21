import { LanguageProvider } from '@pancakeswap/localization'
import { ModalProvider, UIKitProvider, dark, light } from '@pancakeswap/uikit'
import { Store } from '@reduxjs/toolkit'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HistoryManagerProvider } from 'contexts/HistoryContext'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { Provider } from 'react-redux'
import { wagmiConfig } from 'utils/wagmi'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { chains } from 'utils/client'

// Create a client
const queryClient = new QueryClient()

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

const Providers: React.FC<
  React.PropsWithChildren<{ store: Store; children: React.ReactNode; dehydratedState: any }>
> = ({ children, store, dehydratedState }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <RainbowKitProvider theme={darkTheme()} chains={chains}>
              <NextThemeProvider defaultTheme="dark">
                <LanguageProvider>
                  <StyledUIKitProvider>
                    <HistoryManagerProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </HistoryManagerProvider>
                  </StyledUIKitProvider>
                </LanguageProvider>
              </NextThemeProvider>
            </RainbowKitProvider>
          </Provider>
        </WagmiConfig>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export default Providers
