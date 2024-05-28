import OpenAI from "openai";

const message = `\n\n위 키워드들을 자연스럽게 하나의 과정을 설명하는 격식체 문장으로 완성해주세요 문장의 시작은 '이 부품은'으로 시작하고 전체 문장의 글자수는 50글자 미만, 전체적인 기능을 설명해주는 문장으로 개인적인 견해를 배제한 명시적인 의미를 줄 수 있는 문장으로 작성해주세요`

export const gpt = (keywords) => {

  const openai = new OpenAI({apiKey: ''});

  return new Promise(async (resolve, reject) => {
    const result = openai.chat.completions.create({
      messages: [{role: "system", content: keywords + message}],
      model: "gpt-3.5-turbo",
    });

    resolve(result)
  })
}
