import { useNostoOrder, NostoOrderProps } from "@nosto/nosto-react"

export function NostoOrder(props: NostoOrderProps) {
  useNostoOrder(props)    
  return null
}