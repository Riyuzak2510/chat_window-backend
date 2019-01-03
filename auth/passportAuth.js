module.exports = function(passport,FacebookStrategy,config,mongoose){

    const ChatUser = new mongoose.Schema({
        ProfileID: String,
        Fullname: String,
        Profilepic: String
    })

    const userModel = mongoose.model('ChatUser',ChatUser)

    passport.serializeUser(function(err,user){
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done){
        userModel.findByID(id,function(err,user){
            done(err,user)
        })
    })
    passport.use(new FacebookStrategy({
        clientID: config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        proxy: true,
        ProfileFields: ['id','displayname','photos']
    }, function(accesstoken,refreshtoken,profile,done) {
        userModel.findOne({'ProfileID': profile.id},function(err,result){
            if(result)
            {
                done(null,result)
            }
            else {
                const newChatUser = new userModel({
                    ProfileID:profile.id,
                    Fullname:profile.displayname,
                    Profilepic:profile.photos[0].value || ''
                })

                newChatUser.save(function(err) {
                    done(null,newChatUser)
                })
            }
        })
    }))
}