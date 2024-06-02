const SurveyRepository = {
  getSize: `SELECT MAX(CAST(SUBSTRING_INDEX(q.no, '-', 1) AS UNSIGNED INTEGER)) AS max_value
            FROM question q;`,
  get: `SELECT q.*,
               (SELECT id FROM question WHERE id < q.id ORDER BY id DESC LIMIT 1) AS previous_id,
               (SELECT id FROM question WHERE id > q.id ORDER BY id ASC LIMIT 1) AS next_id,
               JSON_ARRAYAGG(
                       JSON_OBJECT(
                               'seq', a.id,
                               'question_id', a.question_id,
                               'title', a.title,
                               'placeholder', a.placeholder,
                               'description', a.description,
                               'unit', a.unit,
                               'type', a.type,
                               'max', a.max,
                               'min', a.min,
                               'step', a.step,
                               'infomation_type', a.infomation_type,
                               'infomation_title', a.infomation_title,
                               'infomation', a.infomation
                           )
                   ) as answer
        FROM question q
            LEFT JOIN answer a
        ON q.id = a.question_id
        WHERE q.id = ?
        GROUP BY q.id
        ORDER BY q.id;
  `,
  save: `INSERT INTO bom(fileInfo, personal, survey, etc, duplicate, answer) VALUES (?,?,?,?,?,?)`,
  getQuestion: `SELECT * FROM question`,
  getBom: `SELECT * FROM bom WHERE id = ?`
}

export default SurveyRepository
