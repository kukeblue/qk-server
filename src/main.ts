// @ts-ignore
import {initTouchService} from "./service/TouchService";
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const expressWs = require('express-ws')(app);
import gameAccountRouter from "./routers/gameAccountRouter";
import deviceRouter from "./routers/deviceRouter";
import taskRouter from "./routers/taskRouter/index";
import taskLogRouter from "./routers/taskLogRouter/index";
import {asyncTaskCount, initTimer} from "./timer";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/game_account', gameAccountRouter)
app.use('/api/device', deviceRouter)
app.use('/api/task', taskRouter)
app.use('/api/task_log', taskLogRouter)


app.listen(3000, '0.0.0.0', async () => {
    initTouchService()
    initTimer()
    console.log(`Example app listening at http://localhost:${3000}`)
})

