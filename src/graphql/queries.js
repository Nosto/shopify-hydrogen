export const nostoMarketQuery = `#graphql
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
`

export const nostoCustomerQuery = `#graphql
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

export const nostoCartQuery = `#graphql
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
`

