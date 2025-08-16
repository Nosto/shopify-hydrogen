// Type declarations for @nosto/nosto-react
declare module "@nosto/nosto-react" {
  import { ReactNode, ComponentType } from "react"

  // Props interfaces
  export interface Nosto404Props {
    placements?: string[]
  }

  export interface NostoCategoryProps {
    category: string
    placements?: string[]
  }

  export interface NostoCheckoutProps {
    placements?: string[]
  }

  export interface NostoHomeProps {
    placements?: string[]
  }

  export interface NostoOrderProps {
    order: any
    placements?: string[]
  }

  export interface NostoOtherProps {
    placements?: string[]
  }

  export interface NostoProductProps {
    product: string
    tagging: {
      selectedVariant?: {
        sku?: string
      }
    }
    placements?: string[]
  }

  export interface NostoSearchProps {
    query: string
    placements?: string[]
  }

  // Hook types
  export function useNosto404(props?: Nosto404Props): void
  export function useNostoCategory(props: NostoCategoryProps): void
  export function useNostoCheckout(props?: NostoCheckoutProps): void
  export function useNostoHome(props?: NostoHomeProps): void
  export function useNostoOrder(props: NostoOrderProps): void
  export function useNostoOther(props?: NostoOtherProps): void
  export function useNostoProduct(props: { product: string; tagging: { product_id: string; selected_sku_id?: string }; placements?: string[] }): void
  export function useNostoSearch(props: NostoSearchProps): void

  // Component types
  interface NostoProviderProps {
    children: ReactNode
    account: string
    shopifyMarkets?: {
      marketId?: string
      language?: string
    }
    currentVariation?: string
    scriptLoader?: (options: { scriptSrc: string }) => void
    nonce?: string
  }

  interface NostoPlacementProps {
    id: string
    [key: string]: any
  }

  interface NostoSessionProps {
    [key: string]: any
  }

  export const NostoProvider: ComponentType<NostoProviderProps>
  export const NostoPlacement: ComponentType<NostoPlacementProps>
  export const NostoSession: ComponentType<NostoSessionProps>
}