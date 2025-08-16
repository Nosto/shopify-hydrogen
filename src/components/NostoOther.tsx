import { useNostoOther } from "@nosto/nosto-react"

interface NostoOtherProps {
  placements?: string[]
}

export default function NostoOther(props: NostoOtherProps) {
  useNostoOther(props)    
  return null
}