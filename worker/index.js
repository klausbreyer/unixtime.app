const baseURL = 'https://www.unixtime.app'
const masURL =
  'https://apps.apple.com/de/app/unixtime-app/id1627321235?l=en&mt=12'
const mssURL =
  'https://apps.microsoft.com/store/detail/unixtimeapp/9NXBTRZH3ZQN?hl=de-de&gl=de'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  const { pathname, search } = url

  await REFS.put(new Date().toISOString(), pathname)

  switch (pathname.substring(0, 5)) {
    case '/mas/':
      return Response.redirect(masURL, 301)
    case '/mss/':
      return Response.redirect(mssURL, 301)
    default:
      return fetch(baseURL)
  }
}
