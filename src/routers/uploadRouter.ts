// @ts-ignore
import express, {Request, Response} from "express"
const qn = require('../service/qiniu')
const router = express.Router()
const multer = require ('multer');
const path = require('path')
const upload = multer({ dest:  path.join(__dirname,'temp')});
router.post('/upload_file', upload.single('file'), async function (req: Request, res:Response) {
    // @ts-ignore
    qn.upImg(req.file.path, req.file.originalname)
    res.json({
        // @ts-ignore
        data: 'http://kuke-static.kukechen.top/' + req.file.originalname,
        status: 0,
    })
})

export default router
