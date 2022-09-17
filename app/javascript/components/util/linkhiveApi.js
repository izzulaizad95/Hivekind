import axios from 'axios'
import qs from 'qs'

const routes = {
  whoami: sessionId => `/api/users/whoami?session_id=${sessionId}`,
  showUrl: slug => `/api/urls/${slug}`,
  showUserUrl: user_id => `/api/urls/user/${user_id}`,
  showInfScrollUrl: ({ slug, stats_count, limit }) =>
    `/api/urls/${slug}?stats_count=${stats_count}&limit=${limit}`,
  createUrl: user_id => `/api/urls?user_id=${user_id}`,
  updateUrl: (id, custom_slug) => `/api/urls/${id}?custom_slug=${custom_slug}`,
  logout: () => '/auth/logout',
  mostRecent: () => '/api/top/recent',
  mostVisited: () => '/api/top/visited',
}

const linkmanApi = {
  whoami(sessionId) {
    return axios.get(routes.whoami(sessionId))
  },

  getUrlData(slug) {
    return axios.get(routes.showUrl(slug))
  },

  getUserUrlData(user_id) {
    return axios.get(routes.showUserUrl(user_id))
  },

  getInfScrollUrlData({ slug, stats_count, limit }) {
    return axios.get(routes.showInfScrollUrl({ slug, stats_count, limit }))
  },

  shortenLink(url, user_id) {
    return axios.post(routes.createUrl(user_id), qs.stringify(url))
  },

  updateUrl(id, custom_slug) {
    return axios.patch(routes.updateUrl(id, custom_slug))
  },

  logout() {
    return axios.delete(routes.logout())
  },

  mostRecent() {
    return axios.get(routes.mostRecent())
  },

  mostVisited() {
    return axios.get(routes.mostVisited())
  },
}

export default linkmanApi
