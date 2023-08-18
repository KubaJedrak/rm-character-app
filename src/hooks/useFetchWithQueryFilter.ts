

export const useFetchWithQueryFilter = async (queryType: string, searchedPhrase: string, ) => {

  const url = "https://rickandmortyapi.com/api"
  const query = ``

  const response = await fetch(`${url}/`)
  const characters = await response.json()
  console.log(characters);
  

}