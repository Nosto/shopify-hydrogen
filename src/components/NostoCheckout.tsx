import { useNostoCheckout } from "@nosto/nosto-react"

interface NostoCheckoutProps {
  placements?: string[]
}

export default function NostoCheckout(props: NostoCheckoutProps) {
  useNostoCheckout(props)    
  return null
}