import dbConn from "../../util/dbConfig/dbConn.js";
import SurveyRepository from "./repository.js";
import {gpt} from "../../util/gptConfig/index.js";
import statusResponse from "../../util/statusResponse/index.js";
import convertSurvey from "../../util/convertSurvey/index.js";

const SurveyService = {
  getSize: async (req, res) => {
    const result = (await dbConn.query(SurveyRepository.getSize))[0]

    res.json(result)
  },
  get: async (req, res) => {

    const {seq} = req.params

    let question = {
      next: 0,
      prev: 0,
      row: []
    }
    const q1 = (await dbConn.query(SurveyRepository.get, [seq]))[0]

    question.row.push(q1)
    
    if (-1 === q1?.next_question_id) {
      question.next = 0
    } else {
      question.next = q1?.next_question_id || q1?.next_id || 0
    }
    question.prev = q1?.previous_id || -1

    if (question.row[0]?.together) {
      const q2 = (await dbConn.query(SurveyRepository.get, [question.row[0].together]))[0]
      question.row.push(q2)
      if (-1 === q2?.next_question_id) {
        question.next = 0
      } else {
        question.next = q2?.next_question_id || q2?.next_id || 0
      }
    }

    res.json(question)
  },
  getBom: async (req, res) => {
    const {seq} = req.params

    const question = (await dbConn.query(SurveyRepository.getQuestion))
    const bom = (await dbConn.query(SurveyRepository.getBom, [seq]))[0]

    const keysToParse = ['fileInfo', 'personal', 'survey', 'etc', 'answer'];

    const bomJson = convertSurvey(bom)

    let temp = {}
    Object.entries(bomJson.answer).map(([key, value]) => {
      const k = key.split('-')

      const item = question.filter(it => {
        return it.id === Number(k[0])
      })[0]
      // console.log(key, value)
      const num = Number(k[1]) > 2 ? Number(k[1]) - 3 : k[1]
      let cnt = ''

      // console.log(k)
      if(k[1]) {
        if (k[0] === '2') cnt = '[' + (Number(k[1]) > 2 ? Number(k[1]) - 1 : k[1]) + '액형]'
        else if (k[0] === '12') cnt = '[' + (Number(k[1]) > 2 ? Number(k[1]) - 1 : k[1]) + '액형]'
        else if (k[0] === '13') cnt = '[' + (Number(k[1]) > 1 ? Number(k[1]) % 3 : k[1]) + '액형]'
        else {
          cnt = `[${Number(k[1]) === 3 ? '2액형' : '1액형'}]`
        }
      }

      if (!temp[item.id]) {
        temp = {
          ...temp,
          [item.id]: {
            no: item.no,
            question: item.title,
            answer: [cnt, value],
            unit: item.unit
          }
        }
      } else {
        temp[item.id].answer.push(...[cnt, value])
      }
      // console.log(item.no, item.title, cnt, value)

    })

    // console.log(temp)

    statusResponse(req, res, 200, null, '조회 성공', {
      person: bomJson.personal,
      answer: temp,
      etc: bomJson.etc,
      equipMent: bomJson.survey.equipMent,
      fileInfo: bomJson.fileInfo
    })
  },
  info: async (req, res) => {
    /**
     * CASE 1
     * {
     *     "1": "1가지", - 1
     *     "2": "1액형", - 2
     *     "5": "LINE_DISPENSING", - 3
     *     "6": "Paste", - 4
     *     "7": "5", - 5
     *     "8": "6", - 6
     *     "9": "10", - 7
     *     "10": "NO",
     *     "11": "자연 경화 ROOM_TEMPERATURE",
     *     "12": "CARTRIDGE",
     *     "13": "3",
     *     "14": "MANUAL",
     *     "16": "HIGH PRICE"
     * }
     *
     * CASE 2
     * {
     *     "1": "2가지", - 1
     *     "2-0": "2액형", - 2
     *     "2-1": "1액형", - 2
     *     "3": "3", - 2 / 1
     *     "4": "사용", - 2 / 1
     *     "5": "LINE_DISPENSING", - 3
     *     "6": "Paste", - 4
     *     "7-0": "5", - 5
     *     "7-1": "11",  - 56
     *     "8": "4", - 6
     *     "9": "5", - 7
     *     "10-0": "NO", - 8
     *     "11-0": "자연 경화 ROOM_TEMPERATURE",  - 9
     *     "12-0": "CARTRIDGE", - 10 - 1
     *     "12-1": "CAN_DRUM", - 10 - 1
     *     "13-1": "3", - 10 - 2
     *     "13-2": "35", - 10 - 2
     *     "14": "MANUAL", - 11
     *     "15": "50,20,111", - 11 - 1
     *     "16": "LOW PRICE" - 12
     * }
     */

    /**
     * CREATE TABLE `robot` (
     *   `product_size_X`  COMMENT 'questionId - 15',
     *   `product_size_Y`  COMMENT 'questionId - 15',
     *   `product_size_Z`  COMMENT 'questionId - 15',
     *
     *   `HIGH_LOW_PRICE`  COMMENT 'questionId - 16'
     * )
     *
     * CREATE TABLE `discharge` (
     *    `ONE_COMPONENT_OR_TWO`                        COMMENT 'questionId - 2',
     *   `USE_TWO_COMPONENT_CARTRIDGE`                COMMENT 'questionId - 4',
     *    HOW_TO_USE_IT`                               COMMENT 'questionId - 5',
     *   `SUPPROT_PASTE`                              COMMENT 'questionId - 6',
     *   `viscosity` int DEFAULT NULL                   COMMENT 'questionId - 6',
     *   `specific_gravity` int DEFAULT NULL            COMMENT 'questionId - 7',
     *   `median_discharge_amount` double DEFAULT NULL COMMENT 'questionId - 8',
     *   `discharge_accuracy` int DEFAULT NULL          COMMENT 'questionId - 9',
     *   `FILLER_SUPPORT`                              COMMENT 'questionId - 10',
     *   `CURING_CONDITIONS`                           COMMENT 'questionId - 11',
     *   `SUPPLY_FORM`                                COMMENT 'questionId - 12',
     *   `AUTOMATION`                                  COMMENT 'questionId - 14',
     *
     * CREATE TABLE `application` (
     *   `mixing_ratio` int DEFAULT NULL       COMMENT 'questionId - 3',
     *   `viscosity` int DEFAULT NULL          COMMENT 'questionId - 6',
     *   `discharge_accuracy` int DEFAULT NULL COMMENT 'questionId - 9',
     *   `SUPPLY_FORM`                         COMMENT 'questionId - 12',
     *
     *   `HIGH_LOW_PRICE`                      COMMENT 'questionId - 16',
     *
     * CREATE TABLE `supply` (
     *   `viscosity` int DEFAULT NULL            COMMENT 'questionId - 6',
     *   `SUPPROT_PASTE`                         COMMENT 'questionId - 6',
     *   `specific_gravity` int DEFAULT NULL     COMMENT 'questionId - 7',
     *   `max_discharge_amount` int DEFAULT NULL COMMENT 'questionId - 8',
     *   `SUPPLY_FORM`                           COMMENT 'questionId - 12',
     *   `supply_capacity_L` double DEFAULT NULL COMMENT 'questionId - 13',
     *
     *   `HIGH_LOW_PRICE`                        COMMENT 'questionId - 16',
     */

    const {answer} = req.body
    const keywords = []

    let answerList = {
      application: [],
      discharge: [],
      supply: [],
      robot: [],
    }

    for (const [key, value] of Object.entries(answer)) {
      const k = key.toString().split('-')
      let result = []

      switch (Number(k[0])) {
        case 2:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE ONE_COMPONENT_OR_TWO = ?', [value === '1액형' ? 'ONE_COMPONENT' : value === '2액형' ? 'TWO_COMPONENT' : 'EVERYTHING']))[0]
          answerList.discharge.push(result[0])
          break;
        case 3:
          result[0] = (await dbConn.query('SELECT * FROM application WHERE mixing_ratio >= ?', [value]))[0]
          answerList.application.push(result[0])
          break;
        case 4:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE USE_TWO_COMPONENT_CARTRIDGE = ?', [value === '사용' ? 'YES' : 'NO']))[0]
          answerList.discharge.push(result[0])
          break;
        case 5:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE HOW_TO_USE_IT = ?', [value === 'CONFORMAL_COATING_SPRAYING_SPRAY_VALVE' ? value : 'EVERYTHING']))[0]
          answerList.discharge.push(result[0])
          break;
        case 6:
          if (value === 'Paste') {
            result[0] = (await dbConn.query('SELECT * FROM discharge WHERE SUPPROT_PASTE = ?', ['EVERYTHING']))[0]
            result[1] = (await dbConn.query('SELECT * FROM supply WHERE SUPPROT_PASTE = ?', ['EVERYTHING']))[0]
            answerList.discharge.push(result[0])
            answerList.supply.push(result[1])
          } else {
            result[0] = (await dbConn.query('SELECT * FROM discharge WHERE viscosity >= ?', [value]))[0]
            result[1] = (await dbConn.query('SELECT * FROM application WHERE viscosity >= ?', [value]))[0]
            result[2] = (await dbConn.query('SELECT * FROM supply WHERE viscosity >= ?', [value]))[0]
            answerList.discharge.push(result[0])
            answerList.application.push(result[1])
            answerList.supply.push(result[2])
          }
          break;
        case 7:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE specific_gravity >= ?', [value]))[0]
          result[1] = (await dbConn.query('SELECT * FROM supply WHERE specific_gravity >= ?', [value]))[0]
          answerList.discharge.push(result[0])
          answerList.supply.push(result[1])
          break;
        case 8:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE median_discharge_amount >= ?', [value === 'EVERYTHING' ? '0' : value]))[0]
          result[1] = (await dbConn.query('SELECT * FROM supply WHERE max_discharge_amount >= ?', [value === 'EVERYTHING' ? '0' : value]))[0]
          answerList.discharge.push(result[0])
          answerList.supply.push(result[1])
          break;
        case 9:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE discharge_accuracy >= ?', [value]))[0]
          result[0] = (await dbConn.query('SELECT * FROM application WHERE discharge_accuracy >= ?', [value]))[0]
          answerList.discharge.push(result[0])
          answerList.application.push(result[1])
          break;
        case 10:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE FILLER_SUPPORT >= ?', [value === 'NO' ? value : 'EVERYTHING']))[0]
          answerList.discharge.push(result[0])
          break;
        case 11:
          result[0] = (await dbConn.query('SELECT * FROM discharge WHERE CURING_CONDITIONS >= ?', [value === '금속 반응 ANAEROBIC_REACTION' ? 'ANAEROBIC_REACTION' : 'EVERYTHING']))[0]
          answerList.discharge.push(result[0])
          break;
        case 12:
          if (value.split(',').length === 4) {
            result[0] = (await dbConn.query('SELECT * FROM application WHERE SUPPLY_FORM = ?', ['EVERYTHING']))[0]
            answerList.application.push(result[0])
          } else {
            value.split(',').map(async (it, key) => {
              result.push((await dbConn.query('SELECT * FROM application WHERE SUPPLY_FORM = ?', [it]))[0])
              answerList.application.push((await dbConn.query('SELECT * FROM application WHERE SUPPLY_FORM = ?', [it]))[0])
              result.push((await dbConn.query('SELECT * FROM supply WHERE SUPPLY_FORM = ?', [it]))[0])
              answerList.supply.push((await dbConn.query('SELECT * FROM supply WHERE SUPPLY_FORM = ?', [it]))[0])
            })
          }
          break;
        case 13:
          result[0] = (await dbConn.query('SELECT * FROM supply WHERE supply_capacity_L > ?', [value]))[0]
          answerList.supply.push(result[0])
          break;
        case 14:
          if (value.split(',').length === 2) {
            result[0] = (await dbConn.query('SELECT * FROM discharge WHERE AUTOMATION = ?', ['EVERYTHING']))[0]
          } else {
            result[0] = (await dbConn.query('SELECT * FROM discharge WHERE AUTOMATION = ?', [value]))[0]
          }
          answerList.discharge.push(result[0])
          break;
        case 15:
          result[0] = (await dbConn.query('SELECT * FROM robot WHERE product_size_X = ? AND product_size_Y = ? AND product_size_X = ?', value.split(',')))[0]
          answerList.robot.push(result[0])
          break;
        case 16:
          if (value.split(',').length === 2) {
            result[0] = (await dbConn.query('SELECT * FROM supply WHERE HIGH_LOW_PRICE = ?', ['EVERYTHING']))[0]
            result[1] = (await dbConn.query('SELECT * FROM robot WHERE HIGH_LOW_PRICE = ?', ['EVERYTHING']))[0]
            result[2] = (await dbConn.query('SELECT * FROM application WHERE HIGH_LOW_PRICE = ?', ['EVERYTHING']))[0]
          } else {
            result[0] = (await dbConn.query('SELECT * FROM supply WHERE HIGH_LOW_PRICE = ?', [value]))[0]
            result[1] = (await dbConn.query('SELECT * FROM robot WHERE HIGH_LOW_PRICE = ?', [value]))[0]
            result[2] = (await dbConn.query('SELECT * FROM application WHERE HIGH_LOW_PRICE = ?', [value]))[0]
          }
          answerList.supply.push(result[0])
          answerList.robot.push(result[1])
          answerList.application.push(result[2])
          break;
      }

      result.map(it => {
        keywords.push(it?.keywords?.replaceAll('\n', '').split('|'))
      })
    }

    // Object.entries(answer).map(async ([key, value]) => {
    //
    // })

    for (const [key, value] of Object.entries(answerList)) {
      answerList[key] = value.filter(it => !!it).map(it => ({
        id: it.id,
        part_name: it.part_name,
        category: it.category,
        cnt: 0,
        single_amount: it.userKRW || 0
      }))
    }

    const ment = await prompt(keywords.filter(it => !!it).flat().join(',\n'))

    statusResponse(req, res, 200, null, '성공', {
      ...answerList,
      equipMent: ment
    })
  },

  save: async (req, res) => {
    const {fileInfo, personal, survey, etc, duplicate, answer} = req.body

    const saveData = await dbConn.query(SurveyRepository.save, [fileInfo, personal, survey, etc, duplicate, answer])

    statusResponse(req, res, 200, null, '성공', {seq: saveData.insertId})
  }
}

const prompt = async (keywords) => {

  const result = await gpt(keywords)

  return result.choices[0].message.content

}

export default SurveyService
