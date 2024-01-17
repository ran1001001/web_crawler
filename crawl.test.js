const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

test('normalizing url protocol', () => {
    expect(normalizeURL('https://example.com/')).toBe('example.com')
});

test('normalizing url port', () => {
    expect(normalizeURL('https://example.com:8080/path')).toBe('example.com/path')
});

test('normalizing url capitals', () => {
    expect(normalizeURL('https://EXAMPLE.com:8080/path/')).toBe('example.com/path')
});

test('normalizing url http', () => {
    expect(normalizeURL('http://example.com:8080/path/')).toBe('example.com/path')
});

test('handle absolute urls', () => {
    const baseURL = 'https://blog.boot.dev'
    const htmlBody = "<html><body><a href='https://blog.boot.dev'><span>Go to boot.dev blogs</span></a></body></html>"
    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = [ 'https://blog.boot.dev' ]
    expect(actual).toEqual(expected)
});

test('handle double forward slashes', () => {
    const baseURL = 'https://blog.boot.dev'
    const htmlBody = "<html><body><a href='//https://blog.boot.dev'><span>Go to boot.dev blogs</span></a></body></html>"
    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = [ 'https://blog.boot.dev' ]
    expect(actual).toEqual(expected)
});

test('handle relative urls', () => {
    const baseURL = 'https://blog.boot.dev'
    const htmlBody = "<html><body><a href='/news'><span>Go to boot.dev blogs</span></a></body></html>"
    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = [ 'https://blog.boot.dev/news' ]
    expect(actual).toEqual(expected)
});

test('handle relative and absolute urls', () => {
    const baseURL = 'https://blog.boot.dev'
    const htmlBody = "<html><body><a href='https://wagslane.dev'><span>Go to Wagslane website</span></a><a href='/news'><span>Go to boot.dev's blogs</span></a></body></html>"
    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = [ "https://wagslane.dev", "https://blog.boot.dev/news" ]
    expect(actual).toEqual(expected)
});

test('faulty anchor tags', () => {
    const baseURL = 'https://blog.boot.dev'
    const htmlBody = "<html><body><a href='https//wagslane.dev'><span>Go to Wagslane website</span></a><a href='news/'><span>Go to boot.dev blogs</span></a></body></html>"
    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = [ ]
    expect(actual).toEqual(expected)
});
