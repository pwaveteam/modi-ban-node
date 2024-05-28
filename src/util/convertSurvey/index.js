const Index = (bom) => {
  const keysToParse = ['fileInfo', 'personal', 'survey', 'etc', 'answer'];

  return Object.keys(bom).reduce((acc, key) => {
    acc[key] = keysToParse.includes(key) ? JSON.parse(bom[key]) : bom[key];
    return acc;
  }, {});
}

export default Index
