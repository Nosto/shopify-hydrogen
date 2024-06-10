import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
import { NostoSession } from '@nosto/shopify-hydrogen'
import { useMatches } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { parseGid, Script } from '@shopify/hydrogen'
import { useLoadScript } from '@shopify/hydrogen-react'


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

  const [scriptUrl, setScriptUrl] = useState(''); // State for the script URL

  const scriptStatus = useLoadScript(scriptUrl); // Hook to load the script
  useEffect(() => {
    if (scriptStatus === 'done') {
      console.log("Script loaded!")
    }
  }, [scriptStatus]);

  return (
    <NostoComponent {...props} shopifyMarkets={shopifyMarkets} currentVariation={currentVariation} setScriptUrl={setScriptUrl} >
      <NostoSession />
      {children}
      {/*<Script src="https://connect.nosto.com/script/shopify/market/nosto.js?merchant=shopify-11368366139&market=29592453179&locale="/>*/}
    </NostoComponent>
  )
}
