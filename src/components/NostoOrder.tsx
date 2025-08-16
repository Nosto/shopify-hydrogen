import { useNostoOrder, NostoOrderProps } from "@nosto/nosto-react"

export default function NostoOrder(props: NostoOrderProps) {
  useNostoOrder(props)    
  return null
}