import { useNosto404 } from "@nosto/nosto-react"

interface Nosto404Props {
  placements?: string[]
}

export default function Nosto404(props: Nosto404Props) {
  useNosto404(props)    
  return null
}