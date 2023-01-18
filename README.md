# @nosto/shopify-hydrogen

- `@nosto/shopify-hydrogen` is a React component library to implement Nosto within Shopify Hydrogen apps.
- The library uses [@nosto/nosto-react](https://github.com/Nosto/nosto-react) under the hood and combines it with Hydrogen specific hooks and functionality.
- You can check our [Hydrogen demo store](https://github.com/Nosto/shopify-hydrogen-demo) to see this library implemented in an actual Hydrogen project.
  > :warning: This project is a work-in-progress and is not yet considered as production-ready. Full functionality will be achieved in our 1.0.0 release planned in Q1/2023.

## Installation

To install the package into your project, run:

```sh
npm install @nosto/shopify-hydrogen
```

Or if you prefer using Yarn:

```sh
yarn add @nosto/shopify-hydrogen
```

## Usage

### Adding the plugin

The first step is to import the Nosto plugin into `vite.config.js` in the root of your Hydrogen project and add it to the plugins array inside the configuration:

```js
//vite.config.js

import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
import nosto from '@nosto/shopify-hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen(), nosto()],
  ...
})
```

### Adding components

The library uses @nosto/nosto-react under the hood and combines it with Hydrogen specific hooks and functionality. You can import the same components as in our native react lib.

#### NostoProvider

- The NostoProvider component is **required** and provides the Nosto functionality.
- It must wrap all other Nosto components.
- Pass your Nosto merchant ID via the `account` prop.

```jsx
// src/App.server.jsx

import { NostoProvider } from "@nosto/shopify-hydrogen";

function App() {
  return (
    <ShopifyProvider>
      <CartProvider>
        <Router>
          <NostoProvider account="shopify-01234567890">
            <FileRoutes />
            <Route path="*" page={<NotFound />} />
          </NostoProvider>
        </Router>
      </CartProvider>
    </ShopifyProvider>
  );
}
```

#### NostoSession

- The NostoSession component syncs customer data and the shopping cart with Nosto.
- No props required, the component handles the whole functionality and interacts with Nosto automatically.

```jsx
// src/App.server.jsx

import { NostoProvider, NostoSession } from "@nosto/shopify-hydrogen";

function App() {
  return (
    <ShopifyProvider>
      <CartProvider>
        <Router>
          <NostoProvider account="shopify-01234567890">
            <FileRoutes />
            <Route path="*" page={<NotFound />} />

            <NostoSession />
          </NostoProvider>
        </Router>
      </CartProvider>
    </ShopifyProvider>
  );
}
```

#### NostoPlacement

- The NostoPlacement component renders a static Nosto placement.
- Pass the placement id via the `id` prop.

```jsx
import { NostoPlacement } from "@nosto/shopify-hydrogen";

<NostoPlacement id="frontpage-nosto-1" />;
```

#### NostoHome

- The NostoHome component needs to be added on the home/front page.
- It loads the campaigns for all the Nosto placements on the page.
- No props required.
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/routes/index.server.jsx

import { NostoHome, NostoPlacement } from "@nosto/shopify-hydrogen";

function HomepageContent() {
  return (
    <>
      ...
      <NostoPlacement id="frontpage-nosto-1" />
      <NostoPlacement id="frontpage-nosto-2" />
      <NostoHome />
    </>
  );
}
```

#### NostoProduct

- The NostoProduct component needs to be added on product pages.
- It loads the campaigns for all the Nosto placements on the page.
- Pass the product id via the `product` prop
- For Nosto tagging pass the product data via the `tagging` prop
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/routes/products/[handle].server.jsx

import {NostoProduct, NostoPlacement} from '@nosto/shopify-hydrogen';

export default function Product() {

  ...
  const {media, title, vendor, descriptionHtml, id, productType} = product;

  let nostoProductId = id.split('/')?.at(-1);

  return (
    <Layout>
      <ProductOptionsProvider data={product}>
        ...
        <NostoPlacement id="productpage-nosto-1" />
        <NostoPlacement id="productpage-nosto-2" />
        <NostoProduct product={nostoProductId} tagging={product} />
      </ProductOptionsProvider>
    </Layout>
  );
}
```

#### NostoCategory

- The NostoCategory component needs to be added on collection pages.
- It loads the campaigns for all the Nosto placements on the page.
- Pass the collection title via the `category` prop.
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/routes/collections/[handle].server.jsx

import { NostoCategory, NostoPlacement } from "@nosto/shopify-hydrogen";

export default function Collection() {
  return (
    <Layout>
      ...
      <NostoPlacement id="categorypage-nosto-1" />
      <NostoPlacement id="categorypage-nosto-2" />
      <NostoCategory category={collection.title} />
    </Layout>
  );
}
```

#### NostoSearch

- The NostoSearch component needs to be added on the search page.
- It loads the campaigns for all the Nosto placements on the page.
- Pass the search term via the `query` prop.
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/routes/search.server.jsx

import { NostoSearch, NostoPlacement } from "@nosto/shopify-hydrogen";

export default function Search() {
  const { searchParams } = useUrl();
  const searchTerm = searchParams.get("q");

  return (
    <SearchPage searchTerm={decodeURI(searchTerm)}>
      <Section>
        ...
        <NostoPlacement id="searchpage-nosto-1" />
        <NostoPlacement id="searchpage-nosto-2" />
        <NostoSearch query={searchTerm ? decodeURI(searchTerm) : ""} />
      </Section>
    </SearchPage>
  );
}
```

#### NostoOther

- The NostoOther component needs to be added on pages with no specific page type.
- It loads the campaigns for all the Nosto placements on the page.
- No props required.
- Must be rendered as last of all Nosto components on the page.

```jsx
import { NostoOther, NostoPlacement } from "@nosto/shopify-hydrogen";

function OtherPage() {
  return (
    <>
      ...
      <NostoPlacement id="other-nosto-1" />
      <NostoPlacement id="other-nosto-2" />
      <NostoOther />
    </>
  );
}
```

#### NostoCheckout

- The NostoCheckout component needs to be added on the cart page.
- It loads the campaigns for all the Nosto placements on the page.
- No props required.
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/components/global/NotFound.server.jsx

import { NostoCheckout, NostoPlacement } from "@nosto/shopify-hydrogen";

export default function Cart() {
  return (
    <Layout>
      ...
      <NostoPlacement id="cartpage-nosto-1" />
      <NostoPlacement id="cartpage-nosto-2" />
      <NostoCheckout />
    </Layout>
  );
}
```

#### Nosto404

- The Nosto404 component needs to be added on 404/not found pages.
- It loads the campaigns for all the Nosto placements on the page.
- No props required.
- Must be rendered as last of all Nosto components on the page.

```jsx
// src/components/global/NotFound.server.jsx

import { NostoOther, NostoPlacement } from "@nosto/shopify-hydrogen";

export function NotFound() {
  return (
    <Layout>
      ...
      <NostoPlacement id="notfound-nosto-1" />
      <NostoPlacement id="notfound-nosto-2" />
      <Nosto404 />
    </Layout>
  );
}
```

## Authors

- **Dominik Gilg** - [dominikgilg](https://github.com/dominikgilg)

See also the list of [contributors](https://github.com/Nosto/shopify-hydrogen/contributors) who participated in this project.

## License

MIT License © Nosto Solutions
