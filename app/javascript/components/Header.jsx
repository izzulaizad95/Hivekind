import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import LayoutContext from '../packs/context/LayoutContext'
import Login from './Login'

const Header = () => {
  const { isMobile } = useContext(LayoutContext)

  return (
    <header className="header row">
      <Link to="/" className="col-lg-6 col-md-6 col-sm-6 col-6 logo">
        <b>Link</b>
        Man
      </Link>
      <Login isMobile={isMobile} />
    </header>
  )
}

export default Header
