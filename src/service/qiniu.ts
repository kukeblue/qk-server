const qiniu = require('qiniu')

let bucket = 'kuke-static' //  七牛云存储空间名
let putPolicy = new qiniu.rs.PutPolicy({ scope: bucket }) //  指定七牛云存储空间
let accessKey = 'dxtgSJJ6qWW-NdM6ZyrStvxDT3P4X7We-r9FOKg_';
let secretKey = 'YKi1Ojq5fDf-vj7cVwPKz__LC4FjwEONI-Xbkqu-';
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey) //  鉴权对象
let uploadToken = putPolicy.uploadToken(mac) //  获取上传凭证

let qn: {
    upToken?: Function,
    upImg?: Function
} = {}

/**
 * 客户端上传
 */
qn.upToken = (bucket: string) => {
    putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })
    let tk = {
        'token': uploadToken,
        'url': 'http://domain.com/'
    }
    return tk
}

/**
 * 服务端上传
 */
qn.upImg = (localFile: string, fileName: string) => {
    let config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0 //  空间对应机房
    // let localFile = '/Users/zzz/Desktop/mac/unit/moon/local/imgs/111.jpeg' //  本地文件
    let formUploader = new qiniu.form_up.FormUploader(config) //  生成表单上传的类
    let putExtra = new qiniu.form_up.PutExtra() //  生成表单提交额外参数
     //  重命名文件
    /**
     * 上传本地文件
     * @param uploadToken 上传凭证
     * @param key 目标文件名
     * @param localFile 本地文件路径
     * @param putExtra 额外选项
     * @param callback
     */
    formUploader.putFile(uploadToken, fileName, localFile, putExtra, function (respErr: Error, respBody:any, respInfo:any) {
        if (respErr) {
            console.log(respErr)
            throw respErr
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody)
        } else {
            console.log(respInfo.statusCode)
            console.log(respBody)
        }
    })
}
module.exports = qn
