module.exports = function(express,app,passport) {
    const route = express.Router()

    route.get('/',function(req,res,next) {
        res.render('index',{title: 'Welcome to MY_CHAT'})
    })

    route.get('/auth/facebook', passport.authenticate('facebook'))
    route.get('/auth/facebook/callback', passport.authenticate('facebook',{
        successRedirect: '/chatrooms',
        failureRedirect: '/'
    }))

    route.get('/chatrooms',(req,res,next) => {
        res.render('chatrooms',{title: 'Chatrooms',user:req.user})
    })

    route.get('/setcolor',(req,res,next) => {
        req.session.favColor = 'Red'
        res.send("Setting Favourite Color!")
    })

    route.get('/getcolor',(req,res,next) => {
        res.send('Favourite Color:' + (req.session.favColor===undefined?"Not Found":req.session.favColor))
    })

    app.use('/',route)
}
