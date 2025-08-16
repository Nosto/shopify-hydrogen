// Type declarations for external dependencies

declare module '@remix-run/react' {
  export function useMatches(): any[]
  export function useAsyncValue(): any
  export function Await(props: { resolve: any; children: React.ReactNode }): JSX.Element
}

declare module '@shopify/hydrogen' {
  export function parseGid(id: string): { id: string }
}