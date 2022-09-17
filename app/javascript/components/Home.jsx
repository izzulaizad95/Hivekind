/* eslint-disable react/jsx-no-target-blank */
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AELogo from '../../assets/images/Frameae.svg'
import autodeskLogo from '../../assets/images/Frameautodesk.svg'
import coleHaanLogo from '../../assets/images/Framecolehaan.svg'
import expediaLogo from '../../assets/images/Frameexpedia.svg'
import mediumLogo from '../../assets/images/Framemedium.svg'
import netflixLogo from '../../assets/images/Framenetflix.svg'
import shopifyLogo from '../../assets/images/Frameshopify.svg'
import timeLogo from '../../assets/images/Frametime.svg'
import editIcon from '../../assets/images/pencil-square.svg'
import trashIcon from '../../assets/images/trash.svg'
import LayoutContext from '../packs/context/LayoutContext'
import { formatDate } from './util/formatDate'
import api from './util/linkhiveApi'

// const { isMobile } = useContext(LayoutContext)

const ShortenForm = ({
  currentUser,
  setMostRecent,
  setMostRecentLoading,
  setUserUrl,
  setUserUrlLoading,
}) => {
  const user = currentUser
  const [url, setUrl] = useState('')
  const [shortenedLink, setShortenedLink] = useState('')
  const [analyticsLink, setAnalyticsLink] = useState('')

  const setState = r => {
    setShortenedLink(r.data.data.url.shortened_link)
    setAnalyticsLink(r.data.data.url.analytics_link)
  }

  const urlFormSubmitHandler = event => {
    event.preventDefault()
    if (user) {
      api.shortenLink({ url }, user.id).then(t => {
        setState(t)
        // recall vanity url to update list dynamically
        setUserUrlLoading(true)
        api.getUserUrlData(user.id).then(r => {
          setUserUrl(r.data.data.url)
          setUserUrlLoading(false)
        })
      })
    } else {
      api.shortenLink({ url }).then(r => {
        setState(r)
        // recall most recent to update list dynamically
        setMostRecentLoading(true)
        api.mostRecent().then(r => {
          setMostRecent(r.data.data.recent)
          setMostRecentLoading(false)
        })
      })
    }
    setUrl('')
  }

  const urlInputChangeHandler = event => {
    setUrl(event.target.value)
  }

  return (
    <>
      <form className="row url-holder" onSubmit={urlFormSubmitHandler}>
        <input
          type="text"
          className="col-sm-8 col-md-8 col-lg-8"
          id="url"
          placeholder="Enter URL"
          value={url}
          onChange={urlInputChangeHandler}
        />
        <button className="col-sm-3 col-md-3 col-lg-3" type="submit">
          Shorten URL
        </button>
        {shortenedLink && analyticsLink && (
          <span>
            link: &nbsp;
            <a href={shortenedLink} target="_blank">
              {shortenedLink}
            </a>
            <br />
            manage: &nbsp;
            <Link to={analyticsLink}>{analyticsLink}</Link>
          </span>
        )}
      </form>
    </>
  )
}

const ColumnItem = ({ headline, description, logo, isMobile }) => (
  <div
    className={`col-lg${!isMobile ? '-4' : '12'} col-md${
      !isMobile ? '-4' : '12'
    } col-sm${!isMobile ? '-4' : '12'} col${
      !isMobile ? '-4' : '12'
    } sub-section`}
  >
    <div className={`shorten row`}>
      <div
      // className={`col-sm${!isMobile ? '-4' : ''} col${
      //   !isMobile ? '-4' : ''
      // } col-md${!isMobile ? '-4' : ''} col-lg${!isMobile ? '-4' : ''}`}
      >
        <div className={`${logo}-logo logo`} />
        <h3
        // className={`col-sm-8 col-8 col-md-8 col-lg-8`}
        >
          {headline}
        </h3>
      </div>
    </div>
    <p>{description}</p>
  </div>
)

const MostRecent = ({ items, mostRecentLoading }) => {
  return (
    <>
      <h4>Most Recent Links</h4>
      <ul>
        {items?.length == 0 && mostRecentLoading ? (
          <b>Loading...</b>
        ) : (
          items.map(i => {
            return (
              <Link to={i.analytics_link} key={i.slug}>
                <li>{`https://linkman.xyz${i.shortened_link}`}</li>
              </Link>
            )
          })
        )}
      </ul>
    </>
  )
}

const MostVisited = ({ items, mostVisitedLoading }) => (
  <>
    <h4>Most Visited Links</h4>
    <ul>
      {items?.length == 0 && mostVisitedLoading ? (
        <b>Loading...</b>
      ) : (
        items.map(i => {
          return (
            <Link to={i.analytics_link} key={i.slug}>
              <li>{`https://linkman.xyz${i.shortened_link}`}</li>
            </Link>
          )
        })
      )}
    </ul>
  </>
)

const UserUrl = ({
  items,
  isMobile,
  currentUser,
  setUserUrl,
  userUrlLoading,
  setUserUrlLoading,
}) => {
  const user = currentUser
  const [toggleCustomInput, setToggleCustomInput] = useState({})
  const [customSlug, setCustomSlug] = useState('')

  const refetchUserUrl = () => {
    setUserUrlLoading(true)
    api.getUserUrlData(user.id).then(r => {
      setUserUrl(r.data.data.url)
      setUserUrlLoading(false)
    })
  }
  const customSlugFormSubmitHandler = ({ id, custom_slug }) => {
    api.updateUrl(id, custom_slug).then(r => {
      setCustomSlug('')
      setToggleCustomInput({})
      refetchUserUrl()
    })
  }

  const unbindUrlHandler = id => {
    api.updateUrl(id, null).then(r => {
      refetchUserUrl()
    })
  }

  const customSlugInputChangeHandler = event => {
    setCustomSlug(event.target.value)
  }

  return (
    <>
      <h4>My Links</h4>
      <div className="analytics-statistics-section white-background padded-container row">
        <table className="table table-hover analytics-table">
          <thead>
            <tr>
              <th className="col-lg-3 col-md-3 col-sm-3 col-10">Short Link</th>
              {!isMobile && (
                <>
                  <th
                    className="col-lg-4 col-md-4 col-sm-4"
                    style={{ textAlign: 'left' }}
                  >
                    Destination URL
                  </th>
                  <th
                    className="col-lg-2 col-md-2 col-sm-2"
                    style={{ textAlign: 'left' }}
                  >
                    Created
                  </th>
                  <th
                    className="col-lg-1 col-md-1 col-sm-1"
                    style={{ textAlign: 'center' }}
                  >
                    Clicks
                  </th>
                </>
              )}
              <th
                className="col-lg-2 col-md-2 col-sm-2 col-2"
                style={{ textAlign: 'right' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {userUrlLoading ? (
              <div style={{ textAlign: 'center', width: '100%' }}>
                Loading...
              </div>
            ) : (
              items &&
              items.map((url, i) => {
                return (
                  <tr key={url.id}>
                    <td className="col-lg-3 col-md-3 col-sm-3 col-10">
                      {toggleCustomInput[url.id] ? (
                        <>
                          <form
                            className="url-holder"
                            onSubmit={() => {
                              customSlugFormSubmitHandler({
                                id: url.id,
                                custom_slug: customSlug,
                              })
                            }}
                          >
                            <span>{`https://linkman.xyz`}</span>
                            <input
                              style={{ margin: '5px' }}
                              type="text"
                              id="custom-url"
                              placeholder="Enter Custom URL"
                              value={customSlug}
                              onChange={customSlugInputChangeHandler}
                            />
                            <button
                              style={{
                                margin: '5px',
                                fontSize: '16px',
                                lineHeight: '24px',
                              }}
                              type="submit"
                            >
                              Submit
                            </button>
                          </form>
                        </>
                      ) : (
                        <Link to={url.analytics_link} key={url.slug}>
                          {`https://linkman.xyz${url.shortened_link}`}
                        </Link>
                      )}
                    </td>
                    {!isMobile && (
                      <>
                        <td
                          className="col-lg-4 col-md-4 col-sm-4 col-6"
                          style={{ textAlign: 'left' }}
                        >
                          <a href={url.url} target="_blank">
                            {url.url}
                          </a>
                        </td>
                        <td
                          className="col-lg-2 col-md-2 col-sm-2"
                          style={{ textAlign: 'left' }}
                        >
                          {formatDate(new Date(url.created_at))}
                        </td>
                        <td
                          className="col-lg-1 col-md-1 col-sm-1"
                          style={{ textAlign: 'center' }}
                        >
                          {url.visit_count}
                        </td>
                      </>
                    )}
                    <td
                      style={{ padding: '0.5rem 0', textAlign: 'right' }}
                      className="col-lg-2 col-md-2 col-sm-2 col-2"
                    >
                      <div>
                        <img
                          src={editIcon}
                          style={{ margin: '0px 4px' }}
                          width="20"
                          height="20"
                          onClick={() => {
                            if (Object.keys(toggleCustomInput).length === 0) {
                              setToggleCustomInput({
                                [`${url.id}`]: true,
                              })
                            } else if (toggleCustomInput[url.id]) {
                              setCustomSlug('')
                              setToggleCustomInput({})
                            } else {
                              setCustomSlug('')
                              setToggleCustomInput({})
                              setToggleCustomInput({
                                [`${url.id}`]: true,
                              })
                            }
                          }}
                        />
                        <img
                          src={trashIcon}
                          style={{ margin: '0px 4px' }}
                          width="20"
                          height="20"
                          onClick={() => {
                            unbindUrlHandler(url.id)
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default () => {
  const currentUser = JSON?.parse(localStorage?.getItem('current_user'))
  const { isMobile } = useContext(LayoutContext)

  const [mostRecent, setMostRecent] = useState([])
  const [mostRecentLoading, setMostRecentLoading] = useState(false)
  const [mostVisited, setMostVisited] = useState([])
  const [mostVisitedLoading, setMostVisitedLoading] = useState(false)
  const [userUrl, setUserUrl] = useState([])
  const [userUrlLoading, setUserUrlLoading] = useState(false)

  useEffect(() => {
    setMostRecentLoading(true)
    api.mostRecent().then(r => {
      setMostRecent(r.data.data.recent)
      setMostRecentLoading(false)
    })

    setMostVisitedLoading(true)
    api.mostVisited().then(r => {
      setMostVisited(r.data.data.visited)
      setMostVisitedLoading(false)
    })

    if (currentUser) {
      setUserUrlLoading(true)
      api.getUserUrlData(currentUser?.id).then(r => {
        setUserUrl(r.data.data.url)
        setUserUrlLoading(false)
      })
    }

    // setUserUrl(currentUser?.urls ?? []) // placeholder before implement actual api
  }, [])

  return (
    <div className="home-page-container">
      <div className="row home-page-top-section">
        <div className="left-div col-sm-6 col-md-6 col-lg-6">
          <div className="left-container">
            <h1>Simplify Your Links</h1>
            <p>
              Shorten your links and see real-time analytics to improve your
              marketing efforts.
            </p>
            <ShortenForm
              currentUser={currentUser}
              setMostRecent={setMostRecent}
              setMostRecentLoading={setMostRecentLoading}
              setUserUrl={setUserUrl}
              setUserUrlLoading={setUserUrlLoading}
            />
          </div>
        </div>
        {!isMobile && <div className="right-div col-sm-6 col-md-6 col-lg-6" />}
      </div>
      <div className="home-page-middle-section text-center">
        <p>
          <b>Trusted by the best teams in the world</b>
        </p>
        <div className="row image-container">
          <img
            className="col-sm col-md col-lg col"
            src={coleHaanLogo}
            width="20"
            height="20"
            alt="COLE HAAN"
          />
          <img
            className="col-sm col-md col-lg col"
            src={mediumLogo}
            width="23"
            height="23"
            alt="MEDIUM"
          />
          <img
            className="col-sm col-md col-lg col"
            src={expediaLogo}
            width="30"
            height="30"
            alt="EXPEDIA"
          />
          <img
            className="col-sm col-md col-lg col"
            src={netflixLogo}
            width="25"
            height="25"
            alt="NETFLIX"
          />
          <img
            className="col-sm col-md col-lg col"
            src={timeLogo}
            width="20"
            height="20"
            alt="TIME"
          />
          <img
            className="col-sm col-md col-lg col"
            src={AELogo}
            width="25"
            height="25"
            alt="A+E"
          />
          <img
            className="col-sm col-md col-lg col"
            src={shopifyLogo}
            width="30"
            height="30"
            alt="SHOPIFY"
          />
          <img
            className="col-sm col-md col-lg col"
            src={autodeskLogo}
            width="30"
            height="30"
            alt="AUTODESK"
          />
        </div>
      </div>
      <div className="home-page-bottom-section row">
        <ColumnItem
          headline="Shorten"
          description="Shorten your links so it's ready to be shared everywhere"
          logo="link"
          isMobile={isMobile}
        />
        <ColumnItem
          headline="Track"
          description="Analytics help you know where your clicks are coming from"
          logo="track"
          isMobile={isMobile}
        />
        <ColumnItem
          headline="Learn"
          description="Understand and visualize your audience"
          logo="people"
          isMobile={isMobile}
        />
      </div>
      <div
        className={`home-page-most-section row ${
          userUrl?.length !== 0 && 'vanity-section'
        }`}
      >
        {userUrl?.length === 0 ? (
          <>
            <div className="col-lg-5 col-md-5 col-sm-5 col-12 sub-section">
              <MostRecent
                items={mostRecent}
                mostRecentLoading={mostRecentLoading}
              />
            </div>
            {!isMobile && <div className="col-lg-1 col-md-1 col-sm-1" />}
            <div className="col-lg-5 col-md-5 col-sm-5 col-12 sub-section">
              <MostVisited
                items={mostVisited}
                mostVisitedLoading={mostVisitedLoading}
              />
            </div>
          </>
        ) : (
          <div className="col-lg-12 col-md-12 col-sm-12 col-12 sub-section vanity-section">
            <UserUrl
              items={userUrl}
              isMobile={isMobile}
              currentUser={currentUser}
              setUserUrl={setUserUrl}
              userUrlLoading={userUrlLoading}
              setUserUrlLoading={setUserUrlLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
