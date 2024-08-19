import { useNonce } from "@shopify/hydrogen"
export default function scriptLoader(scriptSrc, options) {
  return new Promise((resolve, reject) => {
    const nonce = useNonce()
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = scriptSrc
    script.async = true
    script.nonce = nonce
    script.onload = () => resolve()
    script.onerror = () => reject()
    Object.entries(options?.attributes ?? {}).forEach(([k, v]) => script.setAttribute(k, v))
    document.body.appendChild(script)
  })
}