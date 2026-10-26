# @nosto/shopify-hydrogen v3.0.0

v3 moves the library to Hydrogen 2026-10 (`@shopify/hydrogen@^2026.10.0`), the release where Hydrogen becomes a server-handler library. Storefronts on classic Hydrogen (≤ 2026.4.x) should stay on v2: `npm install @nosto/shopify-hydrogen@2`.

## Breaking changes

- **Peer dependencies:** `@shopify/hydrogen@^2026.10.2`, `react` and `react-dom@^19.2.7`, `react-router@^7.15.1`. `react-router-dom` is no longer required.
- **`getNostoData` signature:** `getNostoData({ context, cartId })` is now `getNostoData({ storefrontClient, customerAccount? })`.
  - `storefrontClient` is the request-scoped client from `createStorefrontClient`.
  - `customerAccount` is optional: `{ client, accessToken }`, with the client from `createCustomerAccountClient` and the logged-in customer's access token. Customer data now comes from the Customer Account API instead of the Storefront API's `customerAccessToken`.
  - `cartId` is gone. The cart is read on the client from Hydrogen's cart store.
- **CSP nonce:** Hydrogen 2026-10 no longer ships `useNonce`. Pass the nonce your app generates for its content security policy to `<NostoProvider nonce={...}>`.

## Things to know

- **Render `<NostoProvider>` inside `<CartProvider>`.** `NostoSession` reads the cart from Hydrogen's cart store (`createCartComponents()` from `@shopify/hydrogen/react`). Outside a `CartProvider` the page still works, but Nosto receives no cart data.
- **The market ID field is deprecated.** Storefront API 2026-10 marks `Country.market` as deprecated ("will be removed in a future version of the API"). It still works, and the library uses it to detect the market ID for Shopify Markets, but it will need replacing once Shopify removes it.
- **Customer request failures don't break the page.** If the Customer Account API request fails, for example because of an expired token, Nosto tracks the visitor as a guest.
- **`customer_reference` is unchanged.** The store domain now comes from `storefrontClient.storeUrl`, which gives the same `https://…` value as the classic `getShopifyDomain()`. Existing Nosto customer references keep matching.
- **Cart unit prices are numbers.** `unit_price` now comes from the cart line's `cost.amountPerQuantity` and is sent as a number, not the API's decimal string. Optimistic cart lines that don't have a product ID yet are skipped.
- **Shopify Markets language:** `getNostoData` now returns the request's language with the provider data. Root loaders in 2026-10 apps usually don't return `consent`, which was the only source of the language before.
