import { createProxyMiddleware } from "http-proxy-middleware"
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}`

const rewrite = function () {
  if (process.env.NODE_ENV === "development") {
    return { "/api/dpk": '/api' }
  } else {
    return { "": "/api" }
  }
};

export default createProxyMiddleware({
  target: ENDPOINT,
  changeOrigin: true,
  pathRewrite: rewrite(),//{ "/api/nxrider": '/api' }
  onError(err, req, res) {
    res.json(err || {})
  },
  onProxyReq(proxyReq, req) {
    console.log('process.env', process.env.NODE_ENV)
    if ((req.method == "POST" || req.method == "PATCH" || req.method == "PUT") && req.body) {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        // proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  }
})

export const config = {
  api: {
    bodyParser: false
    // bodyParser: {
    //   sizeLimit: '1000mb'
    // }
  }
}
