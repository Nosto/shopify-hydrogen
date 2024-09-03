import {useNostoProduct} from "@nosto/nosto-react"

export default function NostoProduct(props) {
    const {selectedVariant} = props.tagging
    useNostoProduct({
        product: props.product,
        tagging: {product_id: props.product, selected_sku_id: selectedVariant?.sku}
    })
    return null
}