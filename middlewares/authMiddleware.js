const jwt = require('jsonwebtoken')
const models = require('../models')
require('dotenv').config()

const authenticate = async (req,res,next)=>{

    const header = req.headers['authorization']
    if(header) {
        const token = header.split(' ')[1]
        try{
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            if(decoded){
                const username = decoded.username
                const authUser = await models.User.findOne({
                    where:{
                        username: username
                    }
                })
                if(authUser){
                    next()
                }else{
                    res.json({error: 'Unable to authenticate'})
                }
            } else {
                res.json({error: 'Unable to authenticate'})
            }
        } catch {
            res.json({error: 'Unable to authenticate'})
        }
    } else{
        res.json({error:'Required authorization headers are missing.'})
    }
}

module.exports = authenticate