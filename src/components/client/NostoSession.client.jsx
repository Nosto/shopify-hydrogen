import { NostoSession as NostoComponent } from "@nosto/nosto-react/shopify-hydrogen";
import { useCart } from "@shopify/hydrogen";

export default function (props) {
  const shopifyCart = useCart();

  //Sync cart with Nosto:
  const nostoCart = [];
  shopifyCart.lines.forEach((item) => {
    let product_id =
      item?.merchandise?.product.id.split("/").at(-1) || undefined;
    let sku_id = item?.merchandise?.id.split("/").at(-1) || undefined;
    let quantity = item?.quantity;
    let unit_price = +item?.merchandise?.priceV2?.amount;
    let price_currency_code = item?.merchandise?.priceV2?.currencyCode;

    nostoCart.push({
      product_id,
      sku_id,
      quantity,
      unit_price,
      price_currency_code,
    });
  });

  //Sync customer with Nosto:
  let first_name = props?.customerData?.firstName || undefined;
  let last_name = props?.customerData?.lastName || undefined;
  let email = props?.customerData?.email || undefined;
  let newsletter = props?.customerData?.acceptsMarketing ?? undefined;
  let customer_reference = props?.customerData?.customerReference || undefined;

  let customer = {
    first_name,
    last_name,
    email,
    newsletter,
    customer_reference,
  };

  return <NostoComponent customer={customer} cart={{ items: nostoCart }} />;
}
