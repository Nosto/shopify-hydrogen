import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
import { NostoSession } from "@nosto/shopify-hydrogen"
import { useMatches } from "@remix-run/react"
import { parseGid } from "@shopify/hydrogen"
import createScriptLoader from "../createScriptLoader";

type BaseNostoProviderProps = React.ComponentProps<typeof NostoComponent>

interface NostoProviderProps extends BaseNostoProviderProps {
    nonce: string
}

export function NostoProvider({
                             children,
                             shopifyMarkets: shopifyMarketsProp,
                             nonce,
                             ...props
                         }: NostoProviderProps) {
    const [root] = useMatches()
    const { language } = root?.data?.selectedLocale || {}
    const { market } = root?.data?.nostoProviderData?.localization?.country || {}

    const scriptLoader = createScriptLoader(nonce)

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
