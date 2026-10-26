import * as React from 'react';
import createScriptLoader from '../createScriptLoader';
import { useHydrogenRootFallback } from '../lib/useHydrogenRootFallback';
import { NostoProvider as NostoComponent } from '@nosto/nosto-react';
import { NostoSession } from './NostoSession';

type BaseNostoProviderProps = React.ComponentProps<typeof NostoComponent>;

interface NostoProviderProps extends BaseNostoProviderProps {
  nonce: string;
  currency?: string;
}

function parseId(gid: string) {
  try {
    const { protocol, hostname, pathname } = new URL(gid);
    if (protocol !== 'gid:' || hostname !== 'shopify') return undefined;
    const [, resource, id] = pathname.split('/');
    return resource && id ? id : undefined;
  } catch {
    return undefined;
  }
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
        : (parseId(propMarketId) ?? propMarketId)
      : rootMarketGid
        ? parseId(rootMarketGid)
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
