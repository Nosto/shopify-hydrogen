import { useNostoCategory } from "@nosto/nosto-react"

interface NostoCategoryProps {
  category: string
  placements?: string[]
}

export default function NostoCategory(props: NostoCategoryProps) {
  useNostoCategory(props)    
  return null
}