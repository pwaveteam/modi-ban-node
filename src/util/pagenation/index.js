export const convertPage = (query) => {
  const currentPage = Number(query.currentPage)
  const size = Number(query.size)

  return {
    offset: currentPage * size,
    limit: size
  }
}
