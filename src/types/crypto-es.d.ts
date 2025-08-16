// Type declarations for crypto-es
declare module "crypto-es" {
  export function randomUUID(): string
  export function SHA256(data: string): {
    toString(): string
  }
  const crypto: {
    randomUUID(): string
    SHA256(data: string): {
      toString(): string
    }
  }
  export default crypto
}