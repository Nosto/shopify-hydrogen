# @nosto/shopify-hydrogen

### Welcome to the Nosto React Component Library for Shopify Hydrogen 1! 

Our component library is designed to help you easily integrate Nosto features into your Hydrogen-based storefront.

The library includes a comprehensive set of reusable components, each designed to support a specific feature or functionality of Nosto. With our library, you can quickly and easily implement Nosto features into your storefront.

This README is designed to provide you with an overview of our component library, including instructions on how to install and use our components, as well as information on the features and functionalities that our library supports. 

> :warning: Please note that the information provided in this documentation is specific to Hydrogen 1, a legacy version of Shopify Hydrogen. If your storefront is already running on Hydrogen 2, we recommend referring to our [documentation for Hydrogen 2](https://github.com/Nosto/shopify-hydrogen). This will ensure that you access the appropriate guidance and instructions for your specific version.

## nosto-react

It's important to note that our React component library for Shopify Hydrogen is an extension of our nosto-react library, a powerful and flexible library that provides seamless integration with Nosto. Our Shopify Hydrogen-specific component library builds upon the core functionality of [nosto-react](https://github.com/Nosto/nosto-react), adding Hydrogen-specific hooks and logic to make integration even easier and more intuitive.


## Feature list

Our React component library for Shopify Hydrogen includes the following features:

* Recommendations, including client-side rendering
* Onsite content personalisation
* Dynamic bundles
* Debug toolbar* (excluding advanced use cases)
* Pop-ups & personalised emails
* A/B testing
* Segmentation and Insights
* Analytics
* Search** (when implemented via our code editor)

_*Note: Our React component library currently does not support advanced use cases of the debug toolbar, but we are constantly working to improve our library and provide you with the best possible integration options._

_**Note: The search feature is available when implemented via our code editor._

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
// vite.config.js

import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
import nosto from '@nosto/shopify-hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen(), nosto()],
  ...
})
```

### Adding components

The library uses [@nosto/nosto-react](https://github.com/Nosto/nosto-react) under the hood combined with Hydrogen specific hooks and functionality. You can import the following components:

#### NostoProvider

- The NostoProvider component is **required** and provides the Nosto functionality.
- It must wrap all other Nosto components.
- Pass your Nosto merchant ID via the `account` prop.
- Imports the Nosto client script into the window environment. This is used to controll all of Nosto functionality.

```jsx
// src/App.server.jsx

import { NostoProvider } from "@nosto/shopify-hydrogen";

function App() {
  return (
    <ShopifyProvider>
      <CartProvider>
        <Router>
          <NostoProvider account="shopify-01234567890" recommendationComponent={<NostoSlot />}>
            <FileRoutes />
            <Route path="*" page={<NotFound />} />
          </NostoProvider>
        </Router>
      </CartProvider>
    </ShopifyProvider>
  );
}
```
#### Client side rendering for recommendations

In order to implement client-side rendering, the <NostoProvider> requires a designated component to render the recommendations provided by Nosto. This component should be capable of processing the JSON response received from our backend. Notice the `recommendationComponent={<NostoSlot />}` prop passed to `<NostoProvider>` above. 

We have included a set of basic components as examples, however, additional customizations can be made to suit specific requirements. It is important to note that these components serve as a starting point for implementation.

```jsx
// src/recommendationrender/NostoItem.client.jsx

export function NostoItem({product, onClick}) {
  return (
    <div className="nosto-item" onClick={onClick}>
      <a href={product.url}>
        <div className="nosto-image-container">
          <div className="nosto-image">
            <img src={product.thumb_url} alt={product.name} />
          </div>
          <div className="nosto-product-details">
            <div className="nosto-product-name">{product.name}</div>
            <div className="nosto-product-price">{product.price_text}</div>
          </div>
        </div>
      </a>
    </div>
  );
}
```

Additionally, we have a component that will use `<NostoItem>` in slots defined for recommendations.
```jsx
// src/recommendationrender/NostoSlot.client.jsx

import {NostoItem} from './NostoItem.client';

export function NostoSlot({nostoRecommendation}) {
  let {title, products, result_id} = nostoRecommendation;

  function reportClick(productId) {
    // To report attribution for product clicks towards segmentation & analytics
    window?.nostojs(function (api) {
      api.defaultSession().recordAttribution('vp', productId, result_id).done();
    });
  }

  return (
    <div className="nosto-container">
      <h2 className="nosto-title">{title}</h2>
      <div className="nosto-list">
        {products.map((product) => (
          <NostoItem
            product={product}
            key={product.product_id}
            onClick={() => {
              reportClick(product.product_id);
            }}
          />
        ))}
      </div>
    </div>
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
- Placements are used to inject recommendations	and content directly into the page. It’s advised to add these wherever you may wish to add personalisation later.
- Pass the placement id via the `id` prop.

```jsx
import { NostoPlacement } from "@nosto/shopify-hydrogen";

<NostoPlacement id="frontpage-nosto-1" />;
<NostoPlacement id="frontpage-nosto-2” />;
```
##### :warning: Dynamic placements and Shopify Hydrogen
Please note that the concept of dynamic placements does not apply to Shopify Hydrogen headless environments, as they can interfere with React's DOM rendering process and adversely affect site navigation. As such, we have disabled Nosto's dynamic placement feature in our React component library for Shopify Hydrogen builds. Instead, all placements should be statically placed where needed with the `NostoPlacement` component described above. While dynamic placements may be a useful feature in other environments, we have found that they are not compatible with the unique architecture of Shopify Hydrogen, and can cause unexpected behavior in your storefront.


#### NostoHome

- The NostoHome component needs to be added on the home/front page.
- It loads the campaigns for all the Nosto placements on the page.
- No props required.
- Must be added at the end of all Nosto components on the page. 
- This is a page-specific tag. There are other page-specific components described later in this doc.

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
- It loads the campaigns for all the `<NostoPlacement>`s on the page.
- Pass the product ID via the `product` prop
- For Nosto tagging, pass the product data via the `tagging` prop. This allows Nosto to better personalise the result served to the page.
- Must be added at the end of all Nosto components on the page.

```jsx
// src/routes/products/[handle].server.jsx

import { NostoProduct, NostoPlacement } from '@nosto/shopify-hydrogen';

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
- Must be added at the end of all Nosto components on the page.

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
- Must be added at the end of all Nosto components on the page.

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
- Must be added at the end of all Nosto components on the page.

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
- Must be added at the end of all Nosto components on the page.
- Order details are automatically passed with the help of the Nosto script that is loaded on the page already. Once the user is taken back to the website post-payment, this order information is logged internally. 

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
- Must be added at the end of all Nosto components on the page.

```jsx
// src/components/global/NotFound.server.jsx

import { Nosto404, NostoPlacement } from "@nosto/shopify-hydrogen";

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



### Feedback

If you've found a feature missing or you would like to report an issue, simply [open up an issue](https://github.com/nosto/shopify-hydrogen/issues/new) and let us know. 

We're always collecting feedback and learning from your use-cases. If you find yourself customising widgets and forking the repo to make patches - do drop a message. We'd love to know more and understand how we can make this library even better for you.


## Authors

- **Dominik Gilg** - [dominikgilg](https://github.com/dominikgilg)

See also the list of [contributors](https://github.com/Nosto/shopify-hydrogen/contributors) who participated in this project.

## License

MIT License © Nosto Solutions
