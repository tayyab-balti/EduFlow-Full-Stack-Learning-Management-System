const crypto = require("crypto")

exports.generateSecureString  = (bytes = 18) => {
    return crypto.randomBytes(bytes).toString("base64url")  // 24-character URL-safe Base64 password
}