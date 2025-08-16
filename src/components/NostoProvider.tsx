import { NostoProvider as NostoComponent, NostoProviderProps as BaseNostoProviderProps } from "@nosto/nosto-react"
import { NostoSession } from "@nosto/shopify-hydrogen"
import { useMatches } from "@remix-run/react"
import { parseGid } from "@shopify/hydrogen"
import createScriptLoader from "../createScriptLoader";

interface ShopifyMarkets {
  marketId?: string
  language?: string
}

interface NostoProviderProps extends BaseNostoProviderProps {
  shopifyMarkets?: ShopifyMarkets
  nonce: string
  account: string
  currentVariation?: string
  scriptLoader?: (options: { scriptSrc: string }) => void
}

export function NostoProvider({
                             children,
                             shopifyMarkets: shopifyMarketsProp,
                             ...props
                         }: NostoProviderProps) {
    const [root] = useMatches()
    const { language } = root?.data?.selectedLocale || {}
    const { market } = root?.data?.nostoProviderData?.localization?.country || {}

    const scriptLoader = createScriptLoader(props.nonce)

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
                <NostoSession/>
                {children}
            </NostoComponent>
        </>
    )
}
