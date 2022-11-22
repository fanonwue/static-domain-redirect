import {createServer} from "http";
import {type} from "os";

const targetDomain = process.env.TARGET_DOMAIN || "example.com"
const port = process.env.APP_PORT || 3000

console.info("-- Static Domain Redirect --")
console.info(`Target domain: ${targetDomain}`)

createServer((req, res) => {
    console.debug(`Incoming request: ${req.url}`)
    let protocol = req.headers["x-forwarded-proto"]
    if (!protocol && typeof req.headers["x-forwarded-for"] == "string") protocol = new URL(req.headers["x-forwarded-for"]).protocol
    if (!protocol) protocol = "http"
    console.debug(`Using protocol ${protocol}`)

    const targetUrl = new URL(req.url, `${protocol}://${targetDomain}/`)
    targetUrl.hostname = targetDomain

    console.debug(`Redirecting to: ${targetUrl.href}`)

    res.writeHead(302, {
        Location: targetUrl.href
    })

    res.end()
}).listen(port)

console.info(`Server listening on port ${port}`)