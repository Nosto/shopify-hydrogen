export default function (nonce) {
  return function(scriptSrc, options) {
    return new Promise((resolve, reject) => {
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
}
