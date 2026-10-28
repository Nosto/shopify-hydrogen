import * as React from 'react';
import crypto from 'crypto-es';
import { NostoSession as NostoComponent } from '@nosto/nosto-react';
import type { CartServerHandlers } from '@shopify/hydrogen';
import { createCartComponents } from '@shopify/hydrogen/react';
import { useHydrogenRootFallback } from '../lib/useHydrogenRootFallback';
import { Await, useAsyncValue } from 'react-router';

// Polyfill Array.prototype.at for older browsers:
if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, 'at', {
    value: function (index: number) {
      return index >= 0 ? this[index] : this[this.length + index];
    },
    enumerable: false, configurable: true, writable: true,
  });
}

//The cart hooks read the app's <CartProvider>, so no app-specific typing is needed here:
const { useOptionalCart } = createCartComponents<CartServerHandlers>();

interface CustomerData {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  acceptsMarketing?: boolean;
}
interface AsyncData {
  customer?: CustomerData;
  storeDomain?: string;
}

function useNostoCart() {
  const lines = useOptionalCart((state) => state.data.lines?.nodes);

  //Skip optimistic lines that don't have product details yet:
  const items = lines?.filter((line) => typeof line.merchandise?.product?.id === 'string');

  return items
    ? {
        items: items.map((line) => ({
          product_id: (line.merchandise.product.id as string).split('/').at(-1),
          name: line.merchandise.product.title,
          sku_id: line.merchandise.id.split('/').at(-1),
          quantity: line.quantity,
          unit_price: Number(line.cost?.amountPerQuantity?.amount ?? 0),
          price_currency_code: line.cost?.amountPerQuantity?.currencyCode,
        })),
      }
    : undefined;
}

function AsyncSessionWrapper() {
  const { customer: customerData = {}, storeDomain } = (useAsyncValue() as AsyncData) || {};
  const cart = useNostoCart();

  const customerId = customerData?.id?.split('/')?.at(-1);
  const customer_reference =
    customerId && storeDomain ? crypto.SHA256(customerId + storeDomain).toString() : undefined;

  const customer = {
    customer_reference,
    first_name: customerData?.firstName || undefined,
    last_name: customerData?.lastName || undefined,
    email: customerData?.email || undefined,
    newsletter: customerData?.acceptsMarketing ?? undefined,
  };

  return <NostoComponent customer={customer} cart={cart} />;
}

export function NostoSession() {
  const root = useHydrogenRootFallback();
  const nostoPromise = root?.nostoSessionData;

  return (
    <Await resolve={nostoPromise}>
      <AsyncSessionWrapper />
    </Await>
  );
}
