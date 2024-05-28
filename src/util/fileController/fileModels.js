'use strict'

import dbConn from "../dbConfig/dbConn.js";

export default {
  getFileType: async (type) => {
    const sql = 'Select * from file_type WHERE `name` = ?'
    return await dbConn.query(sql, type)
  }
}
