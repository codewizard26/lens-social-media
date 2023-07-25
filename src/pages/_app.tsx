
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import type { AppProps } from 'next/app'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {

  const desiredChainId = ChainId.Mumbai

  const queryClient = new QueryClient()

  
  return( 
  <ThirdwebProvider activeChain = "mumbai">
  <QueryClientProvider client={queryClient}>
    <Header/>
     <Component {...pageProps} /> 
  </QueryClientProvider>
  </ThirdwebProvider>
  
  )
}
