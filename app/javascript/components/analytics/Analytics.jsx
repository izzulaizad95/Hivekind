/* eslint-disable react/jsx-no-target-blank */
import { createConsumer } from '@rails/actioncable'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as timeago from 'timeago.js'
import lineChartPlaceholder from '../../../assets/images/line_chart_placeholder'
import worldMapPlaceholder from '../../../assets/images/world_map_placeholder'
import api from '../../components/util/linkhiveApi'
import LayoutContext from '../../packs/context/LayoutContext'
import ScrollTopButton from '../button/ScrollTopButton'
import { formatDate } from '../util/formatDate'

const consumer = createConsumer()
// const TOTAL_PAGES = 99999
const LIMIT = 25

// WORKING version of infinite scroll without position memory
const Analytics = () => {
  const { isMobile } = useContext(LayoutContext)

  const [urlData, setUrlData] = useState({})
  const [urlStats, setUrlStats] = useState([])
  const [urlVisitCount, setUrlVisitCount] = useState(0)

  const slug = window.location.pathname.substring(3)

  /* -------------- INFINITE SCROLL ------------- */
  const [loading, setLoading] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lastElement, setLastElement] = useState(null)

  const observer = useRef(
    new IntersectionObserver(entries => {
      const first = entries[0]
      if (first.isIntersecting) {
        setPageNum(no => no + 1)
      }
    })
  )

  const callUrl = async () => {
    setLoading(true)
    setTimeout(() => {
      api
        .getInfScrollUrlData({
          slug: slug,
          stats_count: urlStats.length,
          limit: LIMIT,
        })
        .then(r => {
          const newArr = urlStats.concat(
            Array.from(r.data.data.url.inf_statistics)
          )
          setUrlStats([...newArr])
          setLoading(false)
        })
    }, 500)
  }

  useEffect(() => {
    if (pageNum <= totalPages) {
      callUrl()
    }
  }, [pageNum])

  useEffect(() => {
    const currentElement = lastElement
    const currentObserver = observer.current

    if (currentElement) {
      currentObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [lastElement])

  /* --------------- INITIATE PAGE -------------- */
  useEffect(() => {
    api
      .getInfScrollUrlData({
        slug: slug,
        stats_count: 0,
        limit: LIMIT,
      })
      .then(r => {
        setUrlData(r.data.data.url)
        setUrlVisitCount(r.data.data.url.visit_count)
        setUrlStats(r.data.data.url.inf_statistics)
        setTotalPages(r.data.data.url.statistics.length / LIMIT + 1)
      })

    consumer.subscriptions.create(
      { channel: 'UrlVisitChannel', room: `url_visit:${slug}` },
      {
        received(data) {
          const stats = JSON.parse(data)
          setUrlStats(_urlStats => [stats, ..._urlStats])
          setUrlVisitCount(stats.count)
        },
      }
    )
  }, [])

  /* -------------------------------------------- */
  /*                    CHARTS                    */
  /* -------------------------------------------- */
  /* -------------------------------------------- */
  /*                    GEOMAP                    */
  /* -------------------------------------------- */

  const TableRow = ({ data }) => {
    return (
      <tr key={data.id}>
        <td className="col-lg-4 col-md-4 col-sm-4 col-9">{data.referrer}</td>
        <td
          className="col-lg-4 col-md-4 col-sm-4 col-3"
          style={{ textAlign: isMobile ? 'right' : 'center' }}
        >
          {data.user_agent?.match(/^[a-zA-Z]+/g).join()}
        </td>
        {!isMobile && (
          <>
            <td
              className="col-lg-2 col-md-2 col-sm-2"
              style={{ textAlign: 'center' }}
            >
              {data.country}
            </td>
            <td
              className="col-lg-2 col-md-2 col-sm-2"
              style={{ textAlign: 'right' }}
            >
              {formatDate(new Date(data.created_at))}
            </td>
          </>
        )}
      </tr>
    )
  }

  return (
    <>
      <div className="analytics-container">
        <div className="analytics-metadata-section white-background padded-container">
          <p className="bigger-font">
            Analytics data for&nbsp;
            <a href={urlData.shortened_link}>{`linkman.xyz/${urlData.slug}`}</a>
          </p>
          <p>
            Created&nbsp;
            {timeago.format(urlData.created_at)}
          </p>
          <p>
            Destination URL:&nbsp;
            <a href={urlData.url} target="_blank">
              {urlData.url}
            </a>
          </p>
        </div>

        <div className="analytics-data-section white-background padded-container row">
          <div className="col-lg-3 col-md-3 col-sm-3 col-3">
            <div className="bigger-font">
              <b>{urlVisitCount}</b>
              <br />
            </div>
            <b>Clicks</b>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-9 col-9 timeframe">
            <b className="">Timeframe: &nbsp;</b>
            <button className="realtime" type="button">
              Realtime
            </button>
          </div>
        </div>

        <div className="row padded-container white-background">
          <img
            className="col-lg-6 col-md-6 col-sm-6 col-12 image-container"
            src={lineChartPlaceholder}
            width="100%"
            height="100%"
          />
          <img
            className="col-lg-6 col-md-6 col-sm-6 col-12 image-container"
            src={worldMapPlaceholder}
            width="100%"
            height="100%"
          />
        </div>

        <div className="analytics-statistics-section white-background padded-container row">
          <table className="table table-hover analytics-table">
            <thead>
              <tr>
                <th className="col-lg-4 col-md-4 col-sm-4 col-9">Referrer</th>
                <th
                  className="col-lg-4 col-md-4 col-sm-4 col-3"
                  style={{ textAlign: isMobile ? 'right' : 'center' }}
                >
                  Browser
                </th>
                {!isMobile && (
                  <>
                    <th
                      className="col-lg-2 col-md-2 col-sm-2"
                      style={{ textAlign: 'center' }}
                    >
                      Country
                    </th>
                    <th
                      className="col-lg-2 col-md-2 col-sm-2"
                      style={{ textAlign: 'right' }}
                    >
                      Date/Time
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {urlStats &&
                urlStats.map((stat, i) => {
                  return i === urlStats.length - 1 &&
                    !loading &&
                    pageNum <= totalPages ? (
                    <div key={`${stat.referrer}-${i}`} ref={setLastElement}>
                      <TableRow data={stat} />
                    </div>
                  ) : (
                    <TableRow data={stat} key={`${stat.referrer}-${i}`} />
                  )
                })}
            </tbody>
          </table>
          {loading && (
            <div style={{ textAlign: 'center', width: '100%' }}>Loading...</div>
          )}
        </div>
      </div>
      <ScrollTopButton />
    </>
  )
}

export default Analytics
