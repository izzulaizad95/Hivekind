import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import avatarLogo from '../../assets/images/avatar.svg'
import api from './util/linkhiveApi'

const Login = isMobile => {
  const [user, setUser] = useState({})
  const [sessionId, setSessionId] = useState(null)
  const [toggleMenu, setToggleMenu] = useState(false)

  useEffect(() => {
    let sessId = new URLSearchParams(window.location.search)
      .getAll('session_id')
      .pop()

    if (sessId == null) {
      // maybe the session id is in the cookie?
      sessId = Cookies.get('linkhive_session_id')
    }

    if (sessId != null) {
      Cookies.set('linkhive_session_id', sessId)
      setSessionId(sessId)
      api
        .whoami(sessId)
        .then(r => {
          const currentUser = r.data.data.current_user
          setUser(currentUser)
          localStorage.setItem('current_user', JSON.stringify(currentUser))
        })
        .catch(r => {
          // eslint-disable-next-line no-console
          console.error(r)
          Cookies.remove('linkhive_session_id')
          setSessionId(null)
        })
    } else {
      Cookies.remove('linkhive_session_id')
    }
  }, [])

  const logout = () => {
    console.log('trigger logout')
    api.logout().then(() => {
      setUser({})
      localStorage.removeItem('current_user')
      setSessionId(null)
      Cookies.remove('linkhive_session_id')
      window.location = '/'
    })
  }

  const myRef = useRef()

  const handleClickOutside = e => {
    if (
      !myRef?.current?.contains(e.target) &&
      e.target.id !== 'avatar' &&
      toggleMenu
    ) {
      setToggleMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

  return (
    <>
      {sessionId && user ? (
        <div className="col-lg-6 col-md-6 col-sm-6 col-6 avatar-container">
          <div className="dropdown">
            <img
              id={'avatar'}
              src={avatarLogo}
              width="40"
              height="40"
              alt="AVATAR"
              onClick={() => setToggleMenu(!toggleMenu)}
              // onClick={!toggleMenu ? () => setToggleMenu(true) : null}
            />
            {toggleMenu && (
              <div className="dropdown-content" ref={myRef}>
                <p className="name">{user.name}</p>
                <p className="email">{user.email}</p>
                <button
                  className="logout"
                  onClick={() => {
                    setToggleMenu(false)
                    logout()
                  }}
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="col-lg-6 col-md-6 col-sm-6 col-6 login-signup">
          <a className="login button" href="/auth/developer">
            Login
          </a>
        </div>
      )}
    </>
  )
}

export default Login
