const Client = require('node-ssdp').Client
// import { url } from 'url'

const HYPERION_ST = 'urn:hyperion-project.org:device:basic:1'
let client = new Client({ explicitSocketBind: true })
let ssdpList = []

// emits on each result
client.on('response', onSSDPResponse)

function onSSDPResponse (headers, statusCode, rinfo) {
  if (headers.ST === HYPERION_ST) {
    let url = ''
    try {
      url = new URL(headers.LOCATION)
    } catch (e) {
      console.error('Failed to parse ssdp LOCATION:', headers.LOCATION)
      return
    }
    // port will be empty on 80/443
    if (url.port === '') {
      url.port = url.protocol === 'https:' ? '433' : '80'
    }
    let host = url.hostname + ':' + url.port
    let name = headers.SERVER.split(' ').pop().replace('/', ' V') + ' (' + headers['HYPERION-NAME'] + ')'
    // check if the host address already exists
    if (ssdpList.findIndex(ientry => ientry.value === host) === -1) { ssdpList.push({ label: name, value: host }) }
  }
}

async function getResults () {
  ssdpList = []
  client.search(HYPERION_ST)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ssdpList);
    }, 3000)
  })
}

export { getResults }
