import { useMatches } from '@remix-run/react';
import { useRef } from 'react'

export function useCart() {
    const [root] = useMatches();
    const resolved = useRef(null);

    useEffect(() => {
        if (resolved.current)
            return
        root.data.cart
    }, [root.data.cart])

    return cart.current;
}