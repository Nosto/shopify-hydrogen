/**
 * Creates a custom script loader function which passed to nosto-react component NostoProvider as a prop
 * and used in useLoadClientScript hook for loading scripts. This will override the default script loader behaviour
 * since a `nonce` attribute is required by Shopify for third party scripts. Additionally, this lets the useLoadClientScript
 * to handle building the URL string (scriptSrc in the returned function param).
 */

export default function (nonce) {
    return function (scriptSrc, options) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.type = "text/javascript"
            script.src = scriptSrc
            script.async = true
            script.setAttribute("nonce", nonce)
            script.onload = () => resolve()
            script.onerror = () => reject()
            Object.entries(options?.attributes ?? {}).forEach(([k, v]) => script.setAttribute(k, v))
            if (options?.position === "head") {
                document.head.appendChild(script)
            } else {
                document.body.appendChild(script)
            }
        })
    }
}
