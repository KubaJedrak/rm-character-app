import { useEffect, useState } from "react"
import { PaginationButton } from "../buttons/PaginationButton"
import { CharacterCard } from "./cards/CharacterCard"
import { CharacterSearch } from "../character-search/CharacterSearch"
import './CharacterPages.css'

type Info = {
  count: number,
  next: string | null,
  pages: number,
  prev: string | null
}

export const CharacterPages = () => {

  const [currentPage, setCurrentPage] = useState<number>(1) // starts at 1
  const [activeCards, setActiveCards] = useState(1) // setting it to 1 balances the initial (-1) update to state in CharacterCard
  // const [activeCardsArray, setActiveCardsArray] = useState([])  // TO-DO, add 'number' to the other state
  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState<Info>()
  const [previousPage, setPreviousPage] = useState<string>("")
  const [nextPage, setNextPage] = useState<string>("")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")
  const [pagesTotal, setPagesTotal] = useState<number>()
  const [searchByNameValue, setSearchByNameValue] = useState<any>()
  const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false)
  const [isSearchReady, setIsSearchReady] = useState(false)

  const urlParams = new URLSearchParams(window.location.search);
  const nameSearchParam: string = urlParams.get('name') ?? "";
  const pageSearchParam: string = urlParams.get('page') ?? ""
 

  // --- FUNCTIONS: --- 

  const handleUpdateSearchValue = (searchValue: string) => {
    setSearchByNameValue(searchValue)
  }

  const handleKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      console.log(searchByNameValue);
      console.log(e.key);
      setIsSearchReady(true)
    }
  }

  useEffect(() => { // to remove
    console.log(`searchByNameValue: ${searchByNameValue}`);
    
  }, [searchByNameValue])

  const updateActiveCardsFunc = (isActive: boolean): void => {     // some bug here on backing up??
    if (isActive) setActiveCards(activeCards+1)
    if (!isActive) setActiveCards(activeCards-1)  
  }

  const turnPageBack = (): void => {
    fetchWithQuery(previousPage)    
    if (currentPage > 1) setCurrentPage(currentPage-1)
  }

  const turnPageNext = (): void => {
    const regex = /page=(\d+)/;
    const match = nextPage.match(regex)
    if (match) {
      if (Number(match[1]) !== 1) {
        fetchWithQuery(nextPage)
        setCurrentPage(currentPage+1)
        console.log(nextPage);
      } 
    }    
  }

  const fetchWithQuery = async(replacementURL?: string) => {
    let url = replacementURL ? replacementURL : `https://rickandmortyapi.com/api/character/?name=${nameSearchParam}&page=${pageSearchParam}`
    let query: string = `${url}`

    const response = await fetch(query)
    const data = await response.json()

    if (data.error) {
      setError(data.error)
      return
    }
        
    setInfo(data.info)
    setCharacters(data.results)
    setPreviousPage(data.info.prev ?? "")  
    setNextPage(data.info.next ?? "")      
    setPagesTotal(data.info.pages)
    setReady(true) 
  }

  // --- Search Bar trigger effect: ---
  useEffect( () => {
    if (isSearchReady) {
      fetchWithQuery(`https://rickandmortyapi.com/api/character/?name=${searchByNameValue}`)   
      console.log('ping issearchready');
    }

    
  }, [isSearchReady])

  // --- First API call after website loads ---
  useEffect(() => {
    fetchWithQuery()
    setReady(true)    
  }, [])

  return(
    <div className="container characters-page--container">
      <CharacterSearch handleKeyDown={handleKeyDown} handleUpdateSearchValue={handleUpdateSearchValue} />
      {ready && <>
        <div className="characters-page__active-counter">
          <p className="characters-page--active-counter--page-text">Page: {currentPage}</p>
          <p className="characters-page--active-counter--text">Cards active: <span>{activeCards}</span></p>
        </div>
        <div className="characters-page">
          <ul className="characters-list">
            {characters.map( (character, id) => {
              return(
                <li key={id} className="characters-list__item">
                  <CharacterCard character={character} activeCardTallyFunction={updateActiveCardsFunc} /> 
                </li>
              )
            })}
            {characters.length < 20 && <p>End of list - No more results available.</p>}
          </ul>
        </div> 
        <div className="characters-page--buttons">
          <PaginationButton nextPage={false} handleClick={turnPageBack} />
          <PaginationButton nextPage={true} handleClick={turnPageNext} />
        </div>     
      </>}
      {!ready && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}