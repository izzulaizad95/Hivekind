import React, { useEffect, useState } from 'react'
import LayoutContext from '../packs/context/LayoutContext'
import Routes from '../routes/Index'

// export default () => <>{Routes}</>;

const App = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const [outerWidth, setOuterWidth] = useState(window.outerWidth)

  function handleWindowSizeChange() {
    setInnerWidth(window.innerWidth)
    setOuterWidth(window.outerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = innerWidth <= 575 || outerWidth <= 390 // inner width for dynamic window size change, outer for toggle window size change :sweat_smile:

  // removed documentation for less clutter
  // version 1 only used either inner width or outer width but not both
  return (
    <>
      <LayoutContext.Provider value={{ isMobile }}>
        <Routes />
      </LayoutContext.Provider>
    </>
  )
}

export default App
