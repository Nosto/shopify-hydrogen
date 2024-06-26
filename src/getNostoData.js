export async function getNostoData({ context: { storefront, session }, cartId }) {

  async function getProviderData() {
    //Get Shopify market from localization:
    const countryCode = storefront?.i18n?.country;
    const NOSTO_MARKET_QUERY = `#graphql
                                query GetMarketId @inContext(country: ${countryCode}) {
                                  localization {
                                    country {
                                      market {
                                        id
                                        handle
                                      }
                                    }
                                  }
                                }
                              `;
    const market = countryCode ? await storefront.query(NOSTO_MARKET_QUERY, {
      cache: storefront.CacheNone()
    }) : undefined;

    return market
  }

  async function getSessionData() {
    //Get store domain:
    const storeDomain = storefront?.getShopifyDomain?.();

    //Fetch customer data:
    const customerAccessToken = await session.get('customerAccessToken');
    const NOSTO_CUSTOMER_QUERY = `#graphql
                                  query {
                                    customer(customerAccessToken: "${customerAccessToken}") {
                                      firstName
                                      lastName
                                      email
                                      acceptsMarketing
                                      id
                                    }
                                  }
                              `
    const customer = customerAccessToken ? await storefront.query(NOSTO_CUSTOMER_QUERY, {
      cache: storefront.CacheNone(),
    }) : undefined;

    //Fetch cart data:
    const NOSTO_CART_QUERY = `#graphql
                              query CartQuery($cartId: ID!, $country: CountryCode, $language: LanguageCode)
                                @inContext(country: $country, language: $language) {
                                  cart(id: $cartId) {
                                    lines(first: 100) {
                                      edges {
                                        node {
                                          quantity
                                          merchandise {
                                            ... on ProductVariant {
                                              id
                                              title
                                              price {
                                                currencyCode
                                                amount
                                              }
                                              product {
                                                id
                                                title
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              `;
    const { cart } = !cartId ? {} : await storefront.query(NOSTO_CART_QUERY, {
      variables: {
        cartId,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    return { ...customer, cart, storeDomain }
  }

  return { nostoProviderData: await getProviderData(), nostoSessionData: getSessionData() }
}
