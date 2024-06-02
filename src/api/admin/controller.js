import {Router} from 'express'
import AdminService from "./service.js";

const adminRouter = Router()

adminRouter.get('/bom/list', AdminService.getList)
adminRouter.get('/bom/detail/:seq', AdminService.getDetail)
adminRouter.get('/bom/item/list', AdminService.getItemList)
adminRouter.post('/bom/item/save', AdminService.saveItem)
adminRouter.post("/email", AdminService.sendEmail);

export default adminRouter
