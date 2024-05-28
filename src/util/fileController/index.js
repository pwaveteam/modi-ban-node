'use strict'

import File from './fileModels.js'
import dbConn from "../dbConfig/dbConn.js"

/***********
 조회
 ************/

export const getFileType = (type) => {
  return new Promise((resolve, rejected) => {
    File.getFileType(type).then(result => {
      resolve(result)
    })
  })
}

export const updateFileParent = async (parent, id, type) => {
  const prevImage = await dbConn.query(`SELECT f.*
                                        FROM file f
                                                 INNER JOIN file_type ft ON f.type = ft.id AND ft.name = ?
                                        WHERE f.parent = ?
  `, [type, parent])

  if (prevImage[0]) {
    if (prevImage[0].id !== id) {
      await dbConn.query(`DELETE
                          FROM file
                          WHERE parent = ?
                            and id = ?`, [parent, prevImage[0].id])
    }
  }

  await dbConn.query('UPDATE file SET parent = ? WHERE id = ?', [parent, id])
}
