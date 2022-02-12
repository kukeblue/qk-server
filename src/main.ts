// @ts-ignore
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
import gameAccountRouter from "./routers/gameAccountRouter";
import deviceRouter from "./routers/deviceRouter";
import taskRouter from "./routers/taskRouter/index";
import taskLogRouter from "./routers/taskLogRouter/index";


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/game_account', gameAccountRouter)
app.use('/api/device', deviceRouter)
app.use('/api/task', taskRouter)
app.use('/api/task_log', taskLogRouter)



app.listen(3001, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${3001}`)
})

