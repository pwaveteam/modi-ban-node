import {Router} from 'express'
import SurveyService from "./service.js";

const surveyRouter = Router()

surveyRouter.get('/size', SurveyService.getSize)
surveyRouter.get('/step/:seq', SurveyService.get)
surveyRouter.get('/bom/:seq', SurveyService.getBom)

surveyRouter.post('/infoEquip', SurveyService.info)
surveyRouter.post('/saveSurvey', SurveyService.save)


export default surveyRouter
