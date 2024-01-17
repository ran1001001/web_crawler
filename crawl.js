const { JSDOM } = require('jsdom')

function normalizeURL(urlStr) {
    let url = require('node:url').parse(urlStr);
    let hostname = url.hostname
    let pathname = url.pathname
    let fullpath = hostname + pathname
    if (fullpath.length > 0 && fullpath.slice(-1) === '/'){
        fullpath = fullpath.slice(0, -1)
    }
    return fullpath
}


const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    } catch (e) {
        return false;
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    let links = []
    const doc = new JSDOM(htmlBody)
    const anchors = doc.window.document.querySelectorAll('a')
    for (let index = 0; index < anchors.length; index++) {
        let link = anchors[index].href
        //no '/' slash at the end of url
        if (link.endsWith('/')) {
            link = link.slice(0, -1)
        }
        //no '//' in the beginning of url
        if (link.startsWith('//')) {
            link = link.slice(2)
        }
        //handle faulty url
        if (isValidUrl(link)) {
            links.push(link);
            continue
        }
        //handle relative urls
        if (link.startsWith('/')) {
            link = baseURL + link
            links.push(link);
        }
    }
    return links
};

async function crawlPage(baseURL, currentURL, pages={}) {
    let baseDomain = new URL(baseURL)
    let currentDomain = new URL(currentURL)
    //do not continue if we're crawling in different domain
    if (baseDomain.hostname !== currentDomain.hostname) {
        return pages
    }
    let normalizedCurrent = normalizeURL(currentURL)
    //check entry of current url
    if (normalizedCurrent in pages) {
        pages[normalizedCurrent]++
        return pages
    } else {
        if (currentURL === baseURL) {
            pages[normalizedCurrent] = 0
        } else {
            pages[normalizedCurrent] = 1
        }
    }

    try {
        console.log(`crawling url: ${currentURL}...; normalized to ========> ${normalizedCurrent}`)
        const response = await fetch(currentURL)
        const contentType = await response.headers.get("content-type")
        if ((contentType.slice(0, 9) !== "text/html") || response.status > 399) {
            console.log('===========================')
            console.error("A fail status code or unexpected type.\n");
            console.log(`Current URL: ${currentURL}`);
            console.log(`Status code: ${response.status}`);
            console.log(`Content type: ${contentType}\n`);
            console.log('===========================\n\n')
            return pages
        }
        //html text
        let htmlString = await response.text()
        //urls array
        let urls = getURLsFromHTML(htmlString, baseURL)
        for (let i = 0; i < urls.length; i++) {
            pages = await crawlPage(baseURL, urls[i], pages)
        }
        return pages
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}
