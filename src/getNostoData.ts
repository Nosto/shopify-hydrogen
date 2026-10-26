import type { StorefrontClient } from '@shopify/hydrogen';
import type { CustomerAccountClient } from '@shopify/hydrogen/customer-account';
import { gql } from '@shopify/hydrogen/customer-account';

interface CustomerAccount {
  client: Pick<CustomerAccountClient, 'graphql'>;
  accessToken?: string;
}

interface GetNostoDataParams {
  storefrontClient: Pick<StorefrontClient, 'graphql' | 'storeUrl' | 'requestContext'>;
  customerAccount?: CustomerAccount;
}

//$country and $language are filled in by the storefront client from the request context:
const NOSTO_MARKET_QUERY = `#graphql
  query NostoMarket($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
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

const NOSTO_CUSTOMER_QUERY = gql(`
  query NostoCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
        marketingState
      }
    }
  }
`);

export async function getNostoData({ storefrontClient, customerAccount }: GetNostoDataParams) {
  async function getProviderData() {
    //Get Shopify market from localization:
    const { data } = await storefrontClient.graphql(NOSTO_MARKET_QUERY);

    return {
      localization: data?.localization,
      language: storefrontClient.requestContext.i18n.language,
    };
  }

  async function getSessionData() {
    //Store URL with protocol, same value as the classic getShopifyDomain():
    const storeDomain = storefrontClient.storeUrl;

    //Fetch customer data from the Customer Account API:
    if (!customerAccount?.accessToken) {
      return { storeDomain };
    }

    //An expired token or API error shouldn't break the page, Nosto then tracks the visitor as a guest:
    const data = await customerAccount.client
      .graphql(NOSTO_CUSTOMER_QUERY, { accessToken: customerAccount.accessToken })
      .then((result) => result.data)
      .catch(() => undefined);
    const customer = data?.customer
      ? {
          id: data.customer.id,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          email: data.customer.emailAddress?.emailAddress,
          acceptsMarketing: data.customer.emailAddress?.marketingState === 'SUBSCRIBED',
        }
      : undefined;

    return { customer, storeDomain };
  }

  return { nostoProviderData: await getProviderData(), nostoSessionData: getSessionData() };
}
