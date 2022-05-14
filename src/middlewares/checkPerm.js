function checkPerm(req, res, next) {
    console.log('check permission')
    next()
}

module.exports = checkPerm
