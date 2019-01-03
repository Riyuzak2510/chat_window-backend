const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const indexpage = require('./routes/index')
const config = require('./config/config')
const connectMongo = require('connect-mongo')(session)
const mongoose = require('mongoose')
mongoose.connect(config.dbURL)
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
require('https').globalAgent.options.ca = require('ssl-root-cas').create();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('views',path.join(__dirname,'views'))
app.engine('html',require('hogan-express'))
app.set('view engine','html')
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())

var env1 = process.env.NODE_ENV || 'development';
if(env1 === 'development')
{
    app.use(session({
        secret: config.sessionSecret
    }))
}
else {
    app.use(session({
        secret: config.sessionSecret,
        store: new connectMongo({
            mongoose_connection: mongoose.connections[0],
            stringify: true
        })
    }))
}

app.use(passport.initialize())
app.use(passport.session())

require('./auth/passportAuth')(passport,FacebookStrategy,config,mongoose)

require('./routes/index')(express,app,passport)

app.listen(1759,function(){
    console.log("MY_CHAT working on PORT 1759")
    console.log("Mode: " + env1)
});