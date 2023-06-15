export async function getNostoData({ storefront, session }) {

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

    return { ...customer, storeDomain }
}