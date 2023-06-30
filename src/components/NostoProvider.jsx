import { NostoProvider as NostoComponent } from "@nosto/nosto-react";
import { NostoSession } from '@nosto/shopify-hydrogen'
import { Await, useAsyncValue, useMatches } from '@remix-run/react'
import { parseGid } from '@shopify/hydrogen'

// function AsyncProviderWrapper({ children, shopifyMarkets: shopifyMarketsProp, ...props }) {


//   return (
//     <NostoComponent {...props} shopifyMarkets={shopifyMarkets}>
//       <NostoSession />
//       {children}
//     </NostoComponent>
//   )
// }

export default function ({ children, shopifyMarkets: shopifyMarketsProp, ...props }) {

  //Get nostoData from root remix loader:
  const [root] = useMatches();
  const { language } = root?.data?.selectedLocale || {}
  const { market } = root?.data?.nostoProviderData?.localization?.country || {}
  const currentVariation = props?.currentVariation || root?.data?.selectedLocale?.currency;
  const { id: marketId } = parseGid(market?.id)

  const shopifyMarkets = {
    marketId: shopifyMarketsProp?.marketId || marketId,
    language: shopifyMarketsProp?.language || language
  }

  return (
    <NostoComponent {...props} shopifyMarkets={shopifyMarkets} currentVariation={currentVariation} >
      <NostoSession />
      {children}
    </NostoComponent>
  )
}
