import { useNostoHome } from "@nosto/nosto-react"

interface NostoHomeProps {
  placements?: string[]
}

export default function NostoHome(props: NostoHomeProps) {
  useNostoHome(props)    
  return null
}