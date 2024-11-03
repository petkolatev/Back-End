import util from 'util'
import jsonwebtoken from "jsonwebtoken";

const sign = util.promisify(jsonwebtoken.sign)
const verify = util.promisify(jsonwebtoken.verify)

const jwt = {
    verify,
    sign
}

export default jwt
