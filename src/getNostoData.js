import { nostoMarketQuery, nostoCartQuery, nostoCustomerQuery } from "./graphql/queries";

export async function getNostoData({ context: { storefront, session }, cartId }) {

  async function getProviderData() {
    //Get Shopify market from localization:
    const countryCode = storefront?.i18n?.country;
    const market = countryCode ? await storefront.query(nostoMarketQuery, {
      cache: storefront.CacheNone()
    }) : undefined;

    return market
  }

  async function getSessionData() {
    //Get store domain:
    const storeDomain = storefront?.getShopifyDomain?.();

    //Fetch customer data:
    const customerAccessToken = await session.get('customerAccessToken');
    const customer = customerAccessToken ? await storefront.query(nostoCustomerQuery, {
      cache: storefront.CacheNone(),
    }) : undefined;

    //Fetch cart data:
    const { cart } = !cartId ? {} : await storefront.query(nostoCartQuery, {
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
