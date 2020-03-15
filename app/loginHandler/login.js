module.exports.loggedIn = function(req) {
    if(!req.headers.cookie){
        return false
    } else {
        let isLoggedIn = req.headers.cookie.split('; ').filter( keyVal => keyVal.split("=")[0] === "isLoggedIn" && keyVal.split("=")[1] === "true" )
        try {
            return isLoggedIn[0].split("=")[1]
        } catch {
            return false
        }
   
    }
}

module.exports.logout = function(req, res) {
    req.cookie("userToken", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    req.cookie("isLoggedIn", false)
}

module.exports.clearCookies = function (req, res) {
    res.cookie("username", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
    res.cookie("password", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
}

module.exports.deleteUserTokenCookie = function (req, res) {
    res.cookie("userToken", "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;", {encode: String})
}

module.exports.setLoginCookie = function (req, res) {
    res.cookie("username", req.body.username)
    res.cookie("password", req.body.password)
    res.cookie("isLoggedIn", "true" )
}