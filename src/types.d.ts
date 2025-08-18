declare module "@remix-run/react" {
  export function useMatches(): any[]
  export function Await(props: { resolve: any; children: React.ReactNode }): JSX.Element
  export function useAsyncValue(): any
}

declare module "@shopify/hydrogen" {
  export function parseGid(gid: string): { id: string }
}

declare module "crypto-es" {
  const crypto: {
    SHA256: (input: string) => {
      toString(): string;
    };
  };
  export default crypto;
}