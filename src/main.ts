// @ts-ignore
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
import gameAccountRouter from "./routers/gameAccountRouter";

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/api/gameAccount_router', gameAccountRouter)

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})

