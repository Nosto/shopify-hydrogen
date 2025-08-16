import { useNostoOrder } from "@nosto/nosto-react"

interface NostoOrderProps {
  order: any // Using any for now to avoid complex order typing
  placements?: string[]
}

export default function NostoOrder(props: NostoOrderProps) {
  useNostoOrder(props)    
  return null
}