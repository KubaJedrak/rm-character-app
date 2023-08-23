
type URLParams = {
  nameSearchParam: string | null,
  pageSearchParam: string | null,
  setData: (results?: object, info?: object) => void,
}

export const useFetchWithQuery = () => {

  const fetchWithQuery = async({nameSearchParam, pageSearchParam}: URLParams) => {
    
    const url = "https://rickandmortyapi.com/api/character/?"
    let query: string = `${url}name=${nameSearchParam}&page=${pageSearchParam}`

    let data: object = {}
    
    // if (nameSearchParam && pageSearchParam) {                     // does it make sense to do it this way?
    //   query = `${url}name=${nameSearchParam}&page=${pageSearchParam}`
    // } else if (nameSearchParam && !pageSearchParam) {
    //   query = `${url}name=${nameSearchParam}`
    // } else if (pageSearchParam && !nameSearchParam) {
    //   query = `${url}name=${nameSearchParam}&page=${pageSearchParam}`
    // }
    
    const fetchData = async () => {
      const response = await fetch(query)
      data = await response.json()
    }    
    fetchData()

    return data
  }

  return fetchWithQuery
}