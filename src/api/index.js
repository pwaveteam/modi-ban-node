import {Router} from 'express'
import surveyRouter from "./survey/controller.js";
import uploadRouter from "./upload/upload.js";
import adminRouter from "./admin/controller.js";

const apiRouter = Router()

apiRouter.use('/survey', surveyRouter)
apiRouter.use('/upload', uploadRouter)

apiRouter.use('/admin', adminRouter)
export default apiRouter
