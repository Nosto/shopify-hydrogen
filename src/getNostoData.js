export async function getNostoData({ context: { storefront, session }, cartId }) {

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
  const customer = await storefront.query(NOSTO_CUSTOMER_QUERY, {
    cache: storefront.CacheNone(),
  });

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
                                              price {
                                                currencyCode
                                                amount
                                              }
                                              product {
                                                id
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


