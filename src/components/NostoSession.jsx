import {NostoSession as NostoComponent} from "@nosto/nosto-react";
import crypto from 'crypto-es'

import {Await, useAsyncValue, useMatches} from "@remix-run/react";
import {Suspense} from "react";

//Polyfill the Array.prototype.at() method for all browsers
if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
        value: function (index) {
            if (index >= 0) {
                return this[index];
            } else {
                return this[this.length + index];
            }
        },
        enumerable: false,
        configurable: true,
        writable: true
    });
}

function AsyncSessionWrapper() {

    //Resolve async data:
    const {customer: customerData = {}, cart: shopifyCart, storeDomain} = useAsyncValue() || {};

    //Get customer data to sync with Nosto:
    let customerId = customerData?.id?.split('/').at(-1);
    let customer_reference = customerId && storeDomain ? crypto.SHA256(customerId + storeDomain).toString() : undefined;
    let customer = {
        customer_reference,
        first_name: customerData?.firstName || undefined,
        last_name: customerData?.lastName || undefined,
        email: customerData?.email || undefined,
        newsletter: customerData?.acceptsMarketing ?? undefined
    }

    //Get cart data to sync with Nosto:
    let items = shopifyCart?.lines?.edges?.map(item => item.node)
    let nostoCart = items?.map(item => {
        return {
            product_id: item?.merchandise?.product.id.split("/")?.at(-1),
            name: item?.merchandise?.product.title,
            sku_id: item?.merchandise?.id.split("/")?.at(-1),
            quantity: item?.quantity,
            unit_price: +item?.merchandise?.price?.amount,
            price_currency_code: item?.merchandise?.price?.currencyCode
        }
    })
    let cart = nostoCart ? {items: nostoCart} : undefined;

    return <NostoComponent customer={customer} cart={cart}/>
}

export default function NostoSession() {

    //Get nostoSessionData promise from root remix loader:
    const [root] = useMatches();
    const nostoPromise = root?.data?.nostoSessionData

    return (
        <Suspense>
            <Await resolve={nostoPromise}>
                <AsyncSessionWrapper/>
            </Await>
        </Suspense>
    )
}
