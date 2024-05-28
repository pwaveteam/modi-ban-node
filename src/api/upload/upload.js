import {Router} from 'express'

import fs from 'fs'
import path from 'path'
import multer from 'multer'
import moment from 'moment'
import UploadController from "./upload.controller.js";

const uploadRouter = Router()

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationFolder = 'static/uploads/'
    const dirPath = path.join('', destinationFolder + moment().format('YYYY/MM/DD'))
    const isExists = fs.existsSync( dirPath )

    if(!isExists) {
      fs.mkdirSync(dirPath, { recursive: true }, (err) => {
        if (err) {
          return console.error(err)
        }
      })
    }
    cb(null, dirPath)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

let upload = multer({
  storage : storage
})

uploadRouter.post('/', upload.array('file'), UploadController.upload)

export default uploadRouter
