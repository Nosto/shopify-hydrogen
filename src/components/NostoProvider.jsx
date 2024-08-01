import {NostoProvider as NostoComponent} from "@nosto/nosto-react";
import {NostoSession} from '@nosto/shopify-hydrogen'
import {useMatches} from '@remix-run/react'
import {parseGid, Script} from '@shopify/hydrogen'

export default function ({children, shopifyMarkets: shopifyMarketsProp, ...props}) {

    //Get nostoData from root remix loader:
    const [root] = useMatches();
    const {language} = root?.data?.selectedLocale || {}
    const {market} = root?.data?.nostoProviderData?.localization?.country || {}
    const currentVariation = props?.currentVariation || root?.data?.selectedLocale?.currency;
    const {id: marketId} = parseGid(market?.id)

    const shopifyMarkets = {
        marketId: shopifyMarketsProp?.marketId || marketId,
        language: shopifyMarketsProp?.language || language
    }

    console.log("Im here")

    return (
        <NostoComponent {...props} shopifyMarkets={shopifyMarkets} currentVariation={currentVariation}>
            <NostoSession/>
            {children}
            <Script
                src={"//connect.nosto.com/script/shopify/market/nosto.js?merchant=" + props.account + "&market=" + shopifyMarkets.marketId + "&locale=" + shopifyMarkets.language ? shopifyMarkets : ""}></Script>
        </NostoComponent>
    )
}
