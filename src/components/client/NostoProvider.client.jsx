import { NostoProvider as NostoComponent } from "@nosto/nosto-react";
import { useLocalization, fetchSync } from "@shopify/hydrogen";

export default function (props) {
  const { country } = useLocalization();

  //Get currentVariation based on country:
  const providerProps = {};
  if (props.multiCurrency) {
    const countries = fetchSync("/api/countries").json() || [];
    const currentVariation =
      countries.find((item) => item.isoCode == country.isoCode)?.currency
        ?.isoCode || "";
    providerProps.currentVariation = currentVariation;
  }

  return <NostoComponent {...providerProps} {...props} />;
}
