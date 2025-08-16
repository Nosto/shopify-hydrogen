import { NostoPlacement as NostoComponent } from "@nosto/nosto-react"
import { ComponentProps } from "react"

interface NostoPlacementProps extends ComponentProps<typeof NostoComponent> {
  id: string
}

export default function NostoPlacement(props: NostoPlacementProps) {
  return <NostoComponent {...props} />
}