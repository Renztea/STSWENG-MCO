import React from 'react'
// Components
import Logo from './Logo'
import Menu from './Menu'

export default function Header() {
    var header = <>
        <div className='header'>
            <Logo />
            <Menu />
        </div>
    </>

    return(header)
}