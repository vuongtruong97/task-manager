function maintenance(req, res, next) {
    res.status(503).json({ message: 'Site is currently down, check back soon' })
}
module.exports = maintenance
