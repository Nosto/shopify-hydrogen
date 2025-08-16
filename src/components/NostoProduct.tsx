import { useNostoProduct } from "@nosto/nosto-react"

interface NostoProductProps {
  product: string
  tagging: {
    selectedVariant?: {
      sku?: string
    }
  }
  placements?: string[]
}

export default function NostoProduct(props: NostoProductProps) {
    const { selectedVariant } = props.tagging
    useNostoProduct({
        product: props.product,
        tagging: { product_id: props.product, selected_sku_id: selectedVariant?.sku }
    })
    return null
}