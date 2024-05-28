import {getFileType} from '../../util/fileController/index.js'

import moment from 'moment'
import dbConn from "../../util/dbConfig/dbConn.js";

const UploadController = {
  upload: (req, res) => {

    console.log(req.body)

    const type = req.body.type
    const parent = req.body.parent
    const item = []

    getFileType(type).then(async result => {
      for (let i = 0; i < req.files.length; i++) {
        const name = req.files[i].originalname
        const filename = req.files[i].filename
        const mimetype = req.files[i].mimetype
        const path = req.files[i].path
        const size = req.files[i].size
        const created_at = moment().format()
        const isType = result[0]['id']

        const params = [isType, parent, name, filename, mimetype, path, size, created_at]
        console.log(params)
        const sql = 'INSERT INTO file(`type`, `parent`, `name`, `filename`, `mimetype`, `path`, `size`, `uploaded_at`) VALUES (?,?,?,?,?,?,?,?)'

        // db.query(sql, params, (error, data) => {
        //   console.log(data)
        // })

        item.push({
          id : (await dbConn.query(sql, params)).insertId,
          name: req.files[i].originalname,
          filename: req.files[i].filename,
          mimetype: req.files[i].mimetype,
          path: req.files[i].path,
          size: req.files[i].size,
          created_at: moment().format(),
          type: result[0]['id'],
        })
      }

      res.send({
        title: '완료',
        message: '업로드 완료',
        result: item
      })
    })
  }

}

export default UploadController
