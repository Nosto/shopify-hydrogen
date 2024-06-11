import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
import { NostoSession } from '@nosto/shopify-hydrogen'
import { useMatches, Scripts } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { parseGid } from '@shopify/hydrogen'
import { useLoadScript, useNonce, Script } from '@shopify/hydrogen-react'


export default function ({ children, shopifyMarkets: shopifyMarketsProp, ...props }) {
  //Get nostoData from root remix loader:
  const nonce = useNonce();
  const [root] = useMatches();
  const { language } = root?.data?.selectedLocale || {}
  const { market } = root?.data?.nostoProviderData?.localization?.country || {}
  const currentVariation = props?.currentVariation || root?.data?.selectedLocale?.currency;
  const { id: marketId } = parseGid(market?.id)

  const shopifyMarkets = {
    marketId: shopifyMarketsProp?.marketId || marketId,
    language: shopifyMarketsProp?.language || language
  }

  const [scriptUrl, setScriptUrl] = useState("");
  // State for the script URL, so we can pass it down

  /**props for the useLoadScript hook
   * [src: string, options?: { module?: boolean; in?: "body" | "head"; }]
  */
  const scriptStatus = useLoadScript(scriptUrl, { module: true, in: "head" });
  useEffect(() => {
    if (scriptStatus === 'done') {
      console.log("Script loaded!", scriptStatus)
    }
  }, [scriptStatus]);

  return (
    <NostoComponent {...props} shopifyMarkets={shopifyMarkets} currentVariation={currentVariation} setScriptUrl={setScriptUrl} >
      <NostoSession />
      {children}
      <Script src={scriptUrl} />
      <Scripts nonce={nonce} />
    </NostoComponent>
  )
}
