const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

//an array, the third element is the first argument from command line
const clArgs = process.argv

//if third element is present call main() with that element as input, otherwise console error
clArgs.length === 3 ? main(clArgs[2]) : console.error("Error: no url or multiple urls provided.");

async function main(baseURL) {
    if (baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1)
    }
    console.log(`Crawl starting in BASE: "${baseURL}"...`)
    let currentURL = baseURL
    let pages = await crawlPage(baseURL, currentURL)
    //print report for sorted urls with counts in sortedPages
    console.log("\x1b[31m", "Report is starting...")
    setTimeout(() => {
        let sortedPages = printReport(pages)
        for (const url in sortedPages) {
            const count = sortedPages[url]
            console.log(`Found ${count} internal links to ${url}`)
        }
    }, 5000);
}
