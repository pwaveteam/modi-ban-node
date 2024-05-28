const AdminRepository = {
  getList: `SELECT * FROM bom`,
  getDetail: `SELECT * FROM bom WHERE id = ?`,
  getItemList: (table) => `
    SELECT * FROM ${table}
  `,
  updateSurvey: `UPDATE bom SET survey = ? WHERE id = ?`
}

export default AdminRepository
