declare module 'crypto-es' {
  const crypto: {
    SHA256: (input: string) => {
      toString(): string;
    };
  };
  export default crypto;
}
