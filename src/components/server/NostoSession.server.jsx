import { NostoSession as NostoComponent } from "@nosto/nosto-react/shopify-hydrogen";
import { useShopQuery, gql, useSession, useShop } from "@shopify/hydrogen";
import { sha256 } from "js-sha256";

export default function NostoSession(props) {
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

  console.log("test-hash", sha256("test"));

  if (customerData?.id && storeDomain) {
    customerData.customerReference = sha256(customerData.id + storeDomain);
  }

  return <NostoComponent customerData={customerData} type="NostoSession" />;
}
