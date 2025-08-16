import { useNostoSearch } from "@nosto/nosto-react"

interface NostoSearchProps {
  query: string
  placements?: string[]
}

export default function NostoSearch(props: NostoSearchProps) {
  useNostoSearch(props)    
  return null
}