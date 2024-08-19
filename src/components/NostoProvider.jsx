import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
import scriptLoader from "../scriptLoader"
import { NostoSession } from "@nosto/shopify-hydrogen"
import { useMatches } from "@remix-run/react"
import { parseGid } from "@shopify/hydrogen"

export default function ({
  children,
  shopifyMarkets: shopifyMarketsProp,
  ...props
}) {
  //Get nostoData from root remix loader:
  const [root] = useMatches()
  const { language } = root?.data?.selectedLocale || {}
  const { market } = root?.data?.nostoProviderData?.localization?.country || {}
  const nonce = useNonce()
  const currentVariation =
    props?.currentVariation || root?.data?.selectedLocale?.currency
  const { id: marketId } = parseGid(market?.id)

  const shopifyMarkets = {
    marketId: shopifyMarketsProp?.marketId || marketId,
    language: shopifyMarketsProp?.language || language,
  }

  return (
    <>
      <NostoComponent
        {...props}
        shopifyMarkets={shopifyMarkets}
        currentVariation={currentVariation}
        scriptLoader={scriptLoader}
      >
        <NostoSession />
        {children}
      </NostoComponent>
    </>
  )
}
