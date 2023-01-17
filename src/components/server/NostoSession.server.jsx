import { NostoSessionClient } from "../index.client";
import { useShopQuery, gql, useSession, useShop } from "@shopify/hydrogen";
import { sha256 } from "js-sha256";

export default function NostoSession() {
  const { storeDomain } = useShop();
  const { customerAccessToken } = useSession();
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
  const {
    data: { customer: customerData },
  } = useShopQuery({
    query: QUERY,
  });

  if (customerData?.id && storeDomain) {
    customerData.customerReference = sha256(customerData.id + storeDomain);
    console.log("hashed customer reference:", customerData.customerReference);
  }

  return <NostoSessionClient customerData={customerData} />;
}
