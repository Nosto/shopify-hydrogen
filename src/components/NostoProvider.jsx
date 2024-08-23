import {NostoProvider as NostoComponent} from "@nosto/nosto-react"
import {NostoSession} from "@nosto/shopify-hydrogen"
import {useMatches} from "@remix-run/react"
import {parseGid, Script, useNonce} from "@shopify/hydrogen"
import createScriptLoader from "../createScriptLoader.js";

export default function ({
                             children,
                             shopifyMarkets: shopifyMarketsProp,
                             ...props
                         }) {
    //Get nostoData from root remix loader:
    const [root] = useMatches()
    const {language} = root?.data?.selectedLocale || {}
    const {market} = root?.data?.nostoProviderData?.localization?.country || {}

    // useNonce() hook returns CSP nonce. Used to add a nonce to Nosto script via scriptLoader
    // https://shopify.dev/docs/api/hydrogen/2024-07/hooks/usenonce
    const nonce = useNonce()
    const scriptLoader = createScriptLoader(nonce)

    const currentVariation =
        props?.currentVariation || root?.data?.selectedLocale?.currency
    const {id: marketId} = parseGid(market?.id)

    const shopifyMarkets = {
        marketId: shopifyMarketsProp?.marketId || marketId,
        language: shopifyMarketsProp?.language || language,
    }
    const scriptUrl =
        "//connect.nosto.com/script/shopify/market/nosto.js?merchant=" +
        props.account +
        "&market=" +
        (shopifyMarkets?.marketId ? shopifyMarkets?.marketId : "") +
        "&locale=" +
        (shopifyMarkets?.language ? shopifyMarkets.language : "")

    return (
        <>
            <NostoComponent
                {...props}
                shopifyMarkets={shopifyMarkets}
                currentVariation={currentVariation}
                loadScript={false}
                // scriptLoader={scriptLoader}
            >
                <NostoSession/>
                {children}
                <Script nonce={nonce} src={scriptUrl}></Script>
            </NostoComponent>
        </>
    )
}
