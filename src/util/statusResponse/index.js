/**
 * @version 1.0.1
 * @author 김남규 - vpdls1511@gmail.com
 *
 * [ 정상 ] - index(req, res, 200, null, message, payload)
 *
 * [ 오류 ] - index(req, res, 400 or 500, e.message, message)
 *
 * @param req
 * @param res
 * @param statusCode
 * @param error
 * @param message
 * @param payload
 * @return {*}
 */

const Index = (req, res, statusCode, error, message, payload) => {

  console.log(`[EndPoint / ${req.method}] - ${req.originalUrl}`)
  if(statusCode !== 200) console.log(error)

  return res.status(statusCode).json({
    message: message,
    payload: payload
  })
}

export default Index
