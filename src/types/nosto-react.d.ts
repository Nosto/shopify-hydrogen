// Type declarations for @nosto/nosto-react
declare module "@nosto/nosto-react" {
  import { ReactNode, ComponentType } from "react"

  // Hook types
  export function useNosto404(props?: any): void
  export function useNostoCategory(props: { category: string; placements?: string[] }): void
  export function useNostoCheckout(props?: { placements?: string[] }): void
  export function useNostoHome(props?: { placements?: string[] }): void
  export function useNostoOrder(props: { order: any; placements?: string[] }): void
  export function useNostoOther(props?: { placements?: string[] }): void
  export function useNostoProduct(props: { product: any; placements?: string[]; tagging?: any }): void
  export function useNostoSearch(props: { query: string; placements?: string[] }): void

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