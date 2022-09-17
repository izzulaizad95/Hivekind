import React from 'react'

const ScrollTopButton = () => {
  // Get the button:
  let topbutton = document?.getElementById('topButton')
  let bottombutton = document?.getElementById('bottomButton')

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = () => {
    scrollFunction()
  }

  const scrollFunction = () => {
    if (
      document?.body?.scrollTop > 20 ||
      document?.documentElement?.scrollTop > 20
    ) {
      topbutton.style.display = 'block'
    } else {
      topbutton.style.display = 'none'
    }
    if (
      document.body.scrollHeight - document?.body?.scrollTop > 20 ||
      document.body.scrollHeight - document?.documentElement?.scrollTop > 20
    ) {
      bottombutton.style.display = 'block'
    } else {
      bottombutton.style.display = 'none'
      topbutton.style.bottom = '30px'
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topbutton?.addEventListener('click', scrollToTop)
  bottombutton?.addEventListener('click', scrollToBottom)

  const scrollToTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  const scrollToBottom = () => {
    document.body.scrollTop = document.body.scrollHeight
    document.documentElement.scrollTop = document.body.scrollHeight
  }

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        id="topButton"
        title="Go to top"
      >
        v
      </button>
      <button
        type="button"
        onClick={scrollToBottom}
        id="bottomButton"
        title="Go to bottom"
      >
        v
      </button>
    </>
  )
}

export default ScrollTopButton
