const express = require("express")
const path = require("path")
const router = express.Router()

router.get('/', (req, res)=>{
    express().set('view engine', 'ejs');
    res.render('login.ejs')
})

module.exports = router