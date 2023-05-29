import {NostoProvider as NostoComponent} from "@nosto/nosto-react";
import {useLoaderData} from "@remix-run/react";
import {json} from "@shopify/remix-oxygen";

export async function loader({context}) {
  const country = context.storefront.i18n.country
  return json({country});
}

export default function (props) {
  //Get currentVariation based on country
  const { country } = useLoaderData()
  const providerProps = {};
  if (props.multiCurrency) {
    fetch("/api/countries")
        .then((response) => response.json())
        .then((countries) => {
          providerProps.currentVariation = countries.find((item) => item.isoCode === country.isoCode)?.currency
              ?.isoCode || "";
        });
  }

  return <NostoComponent {...providerProps} {...props} />;
}
