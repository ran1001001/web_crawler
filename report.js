function printReport(pages) {
    const pairs = []
    for (const key in pages) {
        pairs.push([key, pages[key]])
    }
    //reversed sorted urls [["url1", n], ["url2": n-1]...]
    const urls = pairs.sort(function(a, b) {
        return b[1] - a[1]
    });
    let newPages = {}
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        newPages[url[0]] = url[1]
    }
    return newPages
}

module.exports = {
    printReport
}
