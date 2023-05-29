import { NostoSessionClient } from "../index.client";
import { sha256 } from "js-sha256";
import { useLoaderData } from "@remix-run/react";
import invariant from 'tiny-invariant';
import { json } from "@shopify/remix-oxygen";

export async function getCart({storefront}, cartId) {
  invariant(storefront, 'missing storefront client in cart query');

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}

export async function loader({context}) {
  const {storefront} = context;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const { customerData } = await context.storefront.query(QUERY, {
    variables: {
      customerAccessToken
    },
  });
  const {shop} = await storefront.query(
      `query getShopPrimaryDomain { shop { primaryDomain{ url } } }`,
      {
        cache: storefront.CacheLong(),
      },
  );
  const cartId = await context.session.get('cartId')
  let cart = cartId ? await getCart(context, cartId) : undefined

  return json({customerData, shop, cart});
}

export default function NostoSession() {
  const { data: {customerData, shop} } = useLoaderData()

  if (customerData?.id && shop.primaryDomain.url) {
    customerData.customerReference = sha256(customerData.id + shop.primaryDomain.url);
  }

  return <NostoSessionClient customerData={customerData} />;
}

const QUERY = `#graphql
          query {
          customer(customerAccessToken: "${customerAccessToken}") {
            firstName
            lastName
            email
            acceptsMarketing
            id
          }
        }
        `;

const CART_QUERY = `#graphql
  query ($cartId: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
              amountPerQuantity {
                amount
                currencyCode
              }
              compareAtAmountPerQuantity {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                availableForSale
                compareAtPrice {
                  ...MoneyFragment
                }
                price {
                  ...MoneyFragment
                }
                requiresShipping
                title
                image {
                  ...ImageFragment
                }
                product {
                  handle
                  title
                  id
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          ...MoneyFragment
        }
        totalAmount {
          ...MoneyFragment
        }
        totalDutyAmount {
          ...MoneyFragment
        }
        totalTaxAmount {
          ...MoneyFragment
        }
      }
      note
      attributes {
        key
        value
      }
      discountCodes {
        code
      }
    }
  }

  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }

  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;
