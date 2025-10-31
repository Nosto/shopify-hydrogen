import * as React from 'react';
import { parseGid } from '@shopify/hydrogen';
import createScriptLoader from '../createScriptLoader';
import { useHydrogenRootFallback } from '../lib/useHydrogenRootFallback';
import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
import { NostoSession } from './NostoSession';

type BaseNostoProviderProps = React.ComponentProps<typeof NostoComponent>

interface NostoProviderProps extends BaseNostoProviderProps {
  nonce: string;
  currency?: string;
}

export function NostoProvider({
  children,
  currency: currencyProp,
  nonce,
  ...props
}: NostoProviderProps) {
  const root = useHydrogenRootFallback();

  const language = props.shopifyMarkets?.language ?? root.language;

  const currentVariation = props.currentVariation ?? currencyProp;

  const rootMarketGid = root.nostoProviderData?.localization?.country?.market?.id;

  const propMarketId = props.shopifyMarkets?.marketId;

  const marketId: string | number | undefined =
    propMarketId != null
      ? typeof propMarketId === 'number'
        ? propMarketId
        : propMarketId.startsWith('gid://')
          ? (parseGid(propMarketId).id ?? propMarketId)
          : propMarketId
      : rootMarketGid
        ? (parseGid(rootMarketGid).id ?? rootMarketGid)
        : undefined;

  const shopifyMarkets = language && marketId ? { language, marketId } : undefined;

  const scriptLoader = React.useMemo(() => createScriptLoader(nonce), [nonce]);

  return (
        <NostoComponent
          {...props}
          {...(shopifyMarkets ? { shopifyMarkets } : {})}
          currentVariation={currentVariation}
          scriptLoader={scriptLoader}
        >
          <NostoSession />
          {children}
        </NostoComponent>
  );
}









// import { NostoProvider as NostoComponent } from "@nosto/nosto-react"
// import { NostoSession } from "@nosto/shopify-hydrogen"
// import { useMatches } from "@remix-run/react"
// import { parseGid } from "@shopify/hydrogen"
// import createScriptLoader from "../createScriptLoader";

// type BaseNostoProviderProps = React.ComponentProps<typeof NostoComponent>

// interface NostoProviderProps extends BaseNostoProviderProps {
//     nonce: string
// }

// export function NostoProvider({
//                              children,
//                              shopifyMarkets: shopifyMarketsProp,
//                              nonce,
//                              ...props
//                          }: NostoProviderProps) {
//     const [root] = useMatches()
//     const { language } = root?.data?.selectedLocale || {}
//     const { market } = root?.data?.nostoProviderData?.localization?.country || {}

//     const scriptLoader = createScriptLoader(nonce)

//     const currentVariation =
//         props?.currentVariation || root?.data?.selectedLocale?.currency
//     const { id: marketId } = parseGid(market?.id)

//     const shopifyMarkets = {
//         marketId: shopifyMarketsProp?.marketId || marketId,
//         language: shopifyMarketsProp?.language || language,
//     }

//     return (
//         <>
//             <NostoComponent
//                 {...props}
//                 shopifyMarkets={shopifyMarkets}
//                 currentVariation={currentVariation}
//                 scriptLoader={scriptLoader}
//             >
//                 <NostoSession/>
//                 {children}
//             </NostoComponent>
//         </>
//     )
// }
