
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const models = require('./models')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const authenticate = require('./middlewares/authMiddleware')
const bcrypt = require('bcryptjs')
const PORT = process.env.PORT || 8080



app.use(cors())
app.use(express.json())


//GET ROUTES
app.get('/', (req,res)=>{
    res.json({success:true})
})

app.get('/register',(req,res)=>{
    res.json({success:true})
})

app.get('/login',(req,res)=>{
    res.json({success:true})
})

app.get('/:userId/favorites', authenticate, async(req,res)=>{
    
    const userId = req.params.userId
    
    const cards = await models.Favorite.findAll({
        where:{
            favid: userId
        }
    })
    res.json(cards)
    console.log(cards)
})


//POST ROUTES
app.post('/register', async (req,res)=>{
    const {username, password, firstName, lastName} = req.body
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    let user = await models.User.findOne({where: {username:username}})
    if (user){
        res.json({error: 'This username is in use. Please try another'})
    }else{
        const newUser = models.User.build({
            username: username,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
        })
        await newUser.save()
        res.json({sucess:true})
    }
})

app.post('/login', async (req,res)=>{

    const username = req.body.username
    const password = req.body.password

    const savedUser = await models.User.findOne({
        where: {
            username: username,
        }
    })

    if(savedUser){
        const token = jwt.sign({username: savedUser.username}, process.env.JWT_KEY)
        const result = await bcrypt.compare(password, savedUser.password)
        if(result){res.json({success: true, token: token, username: savedUser.username, userId:savedUser.id })
    }else{
        res.json({sucess: false})
        
    }}
})

app.post('/add-fav', authenticate, async (req,res)=>{
    
    console.log(req.body)

    const userId = parseInt(req.body.userId)
    const imageURL = req.body.imageURL

    const savedFav = await models.Favorite.build({
        imageurl: imageURL,
        favid: userId
    })
    await savedFav.save()
    res.json({success:true})

})

app.post('/delete-fav', async(req,res)=>{
    const {id} = req.body
    await models.Favorite.destroy({
        where:{
            id:id
        }
    })
})


app.listen(PORT, ()=>{
    console.log(`Lets play some magic on ${PORT}!`)
})