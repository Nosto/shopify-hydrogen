import { NostoProvider as NostoComponent } from "@nosto/nosto-react";
import { NostoSession } from '@nosto/shopify-hydrogen'
import { Await, useAsyncValue, useMatches } from '@remix-run/react'
import { parseGid } from '@shopify/hydrogen'

function AsyncProviderWrapper({ children, shopifyMarkets: shopifyMarketsProp, ...props }) {
  const [root] = useMatches();
  const { market } = useAsyncValue()?.market?.localization?.country || {}

  const { language } = root?.data?.selectedLocale
  const { id: marketId } = parseGid(market?.id)

  const shopifyMarkets = {
    marketId: shopifyMarketsProp?.marketId || marketId,
    language: shopifyMarketsProp?.language || language
  }

  return (
    <NostoComponent {...props} shopifyMarkets={shopifyMarkets}>
      <NostoSession />
      {children}
    </NostoComponent>
  )
}

export default function ({ children, ...props }) {

  //Get nostoData promise from root remix loader:
  const [root] = useMatches();
  const nostoPromise = root?.data?.nostoData;

  const currentVariation = props?.currentVariation || root?.data?.selectedLocale?.currency;

  //If shopifyMarkets is truthy, we render NostoProvider with an Async Await wrapper to fetch the market id via the storefront API:
  if (props.shopifyMarkets && !!nostoPromise) {
    return (
      <Await resolve={nostoPromise}>
        <AsyncProviderWrapper {...props} currentVariation={currentVariation}>
          {children}
        </AsyncProviderWrapper>
      </Await >
    )
  }

  return (
    <NostoComponent {...props} currentVariation={currentVariation} >
      <NostoSession />
      {children}
    </NostoComponent>
  )
}
