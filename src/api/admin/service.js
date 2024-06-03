import statusResponse from "../../util/statusResponse/index.js";
import dbConn from "../../util/dbConfig/dbConn.js";
import AdminRepository from "./repository.js";
import convertSurvey from "../../util/convertSurvey/index.js";
import nodeMailer from "nodeMailer";

const AdminService = {
  getList: async (req, res) => {
    const result = await dbConn.query(AdminRepository.getList)
    const bom = []

    result.map(it => {
      bom.push(convertSurvey(it))
    })

    statusResponse(req, res, 200, null ,'성공', {bom})
  },
  getDetail: async (req, res) => {
    const result = await dbConn.query(AdminRepository.getDetail, [req.params.seq])

    statusResponse(req, res, 200, null ,'성공', convertSurvey(result[0]))
  },
  getItemList: async (req, res) => {
    const application = await dbConn.query(AdminRepository.getItemList('application'))
    const discharge = await dbConn.query(AdminRepository.getItemList('discharge'))
    const robot = await dbConn.query(AdminRepository.getItemList('robot'))
    const supply = await dbConn.query(AdminRepository.getItemList('supply'))
    statusResponse(req, res, 200, null ,'성공', {
      application: application,
      discharge: discharge,
      robot: robot,
      supply: supply,
    })

  },


  saveItem: async (req, res) => {
    const {answer, duplicate, etc, fileInfo, id, personal, survey} = req.body

    await dbConn.query(AdminRepository.updateSurvey, [JSON.stringify(survey), id])

    statusResponse(req, res, 200, null , '성공')
  },

  sendEmail: async (req, res) => {
    const { email, subject, data } = req.body;

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: { user: "tjddus1109@gmail.com", pass: process.env.MAIL_TOKEN },
    });

    const mailOptions = {
      from: 'Banseokdispenser@gmail.com',
      to: email,
      subject: subject,
      html: JSON.stringify(data, null, 2),
    };
    await transporter.sendMail(mailOptions);

    statusResponse(req, res, 200, null, "성공");
  },
}

export default AdminService
