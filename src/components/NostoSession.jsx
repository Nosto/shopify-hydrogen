import { NostoSession as NostoComponent } from "@nosto/nosto-react";
import { sha256 } from "js-sha256";
import { useMatches, Await, useAsyncValue } from "@remix-run/react";

function AsyncSessionWrapper({ customer }) {
    const shopifyCart = useAsyncValue();

    if (!shopifyCart) return <NostoComponent customer={customer} />

    let items = shopifyCart.lines.edges.map(item => item.node)
    let nostoCart = items.map(item => {
        return {
            product_id: item?.merchandise?.product.id.split("/")?.at(-1),
            sku_id: item?.merchandise?.id.split("/")?.at(-1),
            quantity: item?.quantity,
            unit_price: +item?.merchandise?.price?.amount,
            price_currency_code: item?.merchandise?.price?.currencyCode
        }
    })
    console.log('Async Session rendered');
    console.log({ nostoCart, customer })

    return <NostoComponent customer={customer} cart={{ items: nostoCart }} />
}

export default function NostoSession() {

    //Get nostoData from root remix loader:
    const [root] = useMatches();
    const { customer: customerData = {}, storeDomain } = root?.data?.nostoData;
    console.log({ root })

    //Get customer data to sync with Nosto:
    let customerId = customerData?.id?.split('/').at(-1);
    let customer_reference = customerId && storeDomain ? sha256(customerId + storeDomain) : undefined;
    let customer = {
        customer_reference,
        first_name: customerData?.firstName || undefined,
        last_name: customerData?.lastName || undefined,
        email: customerData?.email || undefined,
        newsletter: customerData?.acceptsMarketing ?? undefined
    }

    return (
        <Await resolve={root.data?.cart}>
            <AsyncSessionWrapper customer={customer} />
        </Await>
    )
}
