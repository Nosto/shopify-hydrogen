import { NostoSessionClient } from "../index.client";
import { gql, useSession, useShop } from "@shopify/hydrogen";
import { sha256 } from "js-sha256";

export async function loader({params, context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const {shop, product} = await context.storefront.query(QUERY, {
    variables: {
      customerAccessToken
    },
  });

  return json({shop, product});
}

export default function NostoSession() {
  const { storeDomain } = useShop();

  const {
    data: { customer: customerData },
  } = useShopQuery({
    query: QUERY,
  });//TODO replace with remix useLoaderData

  if (customerData?.id && storeDomain) {
    customerData.customerReference = sha256(customerData.id + storeDomain);
  }

  return <NostoSessionClient customerData={customerData} />;
}
const QUERY = gql`
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