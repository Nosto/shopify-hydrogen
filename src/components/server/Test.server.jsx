// import { NostoSession as NostoComponent } from "@nosto/nosto-react";
import { useShopQuery, gql, useSession, useShop } from "@shopify/hydrogen";
// import Crypto from "node:crypto";
import { sha256 } from "js-sha256";
// import { TestComponent as NostoComponent } from "@nosto/test-component";
import { NostoSession as NostoComponent } from "@nosto/nosto-react";

export default function (props) {
  console.log("NOSTO SESSION!!! :)");

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

  let hash = sha256("test");
  console.log("hash: ", hash);

  console.log(customerData?.id);

  //   if (customerData?.id && storeDomain) {
  //     customerData.customerReference = Crypto.createHash("sha256")
  //       .update(customerData.id + storeDomain)
  //       .digest("hex");
  //   }

  //   console.log("REFEERNCE: ", customerData?.customerReference);

  //   return <div>NOSTO SERVER TEST</div>;
  //   return <NostoComponent customerData={customerData} type="NostoSession" />;
  return <NostoComponent />;
}
