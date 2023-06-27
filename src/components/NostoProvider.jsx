import { NostoProvider as NostoComponent } from "@nosto/nosto-react";
import { NostoSession } from '@nosto/shopify-hydrogen'
import { Await, useAsyncValue } from '@remix-run/react'

function AsyncProviderWrapper(children, ...props) {

  const { market } = useAsyncValue();
  console.log('provider Async', market)

  return (
    <NostoComponent {...props}>
      <NostoSession />
      {children}
    </NostoComponent>
  )
}

export default function ({ children, shopifyMarkets, ...props }) {

  if (shopifyMarkets) {

    //Get nostoData promise from root remix loader:
    const [root] = useMatches();
    const nostoPromise = root?.data?.nostoData;

    return (
      <Await resolve={nostoPromise}>
        <AsyncProviderWrapper {...props}>
          {children}
        </AsyncProviderWrapper>
      </Await>
    )
  }

  return (
    <NostoComponent {...props}>
      <NostoSession />
      {children}
    </NostoComponent>
  )
}
