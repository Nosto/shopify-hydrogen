import { NostoProvider as NostoComponent } from "@nosto/nosto-react";
import { NostoSession } from '@nosto/shopify-hydrogen'


export default function ({ children, ...props }) {
  return (
    <NostoComponent {...props}>
      <NostoSession />
      {children}
    </NostoComponent>
  )
}
