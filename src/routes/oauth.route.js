const express = require('express')
const querystring = require('querystring')

const oauthRouter = express.Router()
const { GG_OAUTH_CLIENT_ID, GG_OAUTH_CLIENT_SECRET } = process.env

const getGoogleAuthUrl = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: `http://localhost:3000/oauth/google`,
        client_id: GG_OAUTH_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
    }
    return `${rootUrl}?${querystring.stringify(options)}`
}

oauthRouter.get('/google', (req, res) => {
    res.json(req.query)
})

module.exports = oauthRouter
