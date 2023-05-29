import { NostoSession as NostoComponent } from "@nosto/nosto-react/shopify-hydrogen";
import {useCart} from "../../hooks/getCart.js";

/* Polyfill for older platforms that don't support Array.at()
  Reference: https://github.com/tc39/proposal-relative-indexing-method#polyfill
 */
function at(n) {
  // ToInteger() abstract op
  n = Math.trunc(n) || 0;
  // Allow negative indexing from the end
  if (n < 0) n += this.length;
  // OOB access is guaranteed to return undefined
  if (n < 0 || n >= this.length) return undefined;
  // Otherwise, this is just normal property access
  return this[n];
}

const TypedArray = Reflect.getPrototypeOf(Int8Array);
for (const C of [Array, String, TypedArray]) {
  Object.defineProperty(C.prototype, "at",
      { value: at,
        writable: true,
        enumerable: false,
        configurable: true });
}

export default function (props) {
  const shopifyCart = useCart();
  console.log("Shopify Cart", shopifyCart)

  //Sync cart with Nosto:
  const nostoCart = [];
  shopifyCart.lines.forEach((item) => {
    let product_id = item?.merchandise?.product.id.split("/")?.at(-1);
    let sku_id = item?.merchandise?.id.split("/")?.at(-1);
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
