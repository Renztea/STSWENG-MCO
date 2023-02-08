import React from 'react'

export default function MenuButtons () {
    var buttons = <>
        <a href="/products/cake"><button className="menuBtn">CAKES</button></a>
        <a href="/products/cupcake"><button className="menuBtn">CUPCAKES</button></a>
        <a href="/products/cookie"><button className="menuBtn">DECORATED COOKIES</button></a>
        <a href="/about"><button id="aboutBtn" className="menuBtn">ABOUT</button></a>
        <form action="/basket">
            <button id="basketBtn" type="submit" className="menuBtn"><img src="/images/CartBefore.png" alt="CartBefore.png" /></button>
        </form>
    </>
    return(buttons)
}
