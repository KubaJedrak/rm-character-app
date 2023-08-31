import { useEffect, useState } from "react"
import { PaginationButton } from "../buttons/PaginationButton"
import { CharacterCard } from "./cards/CharacterCard"
import { CharacterSearch } from "../character-search/CharacterSearch"
import './CharacterPages.css'

type AppBounds = {
  appBounds: any
}

export const CharacterPages = ({appBounds}: AppBounds) => {

  const [currentPage, setCurrentPage] = useState<number>(1) // starts at 1
  const [activeCards, setActiveCards] = useState<number[]>([]) 
  const [characters, setCharacters] = useState([])
  const [nextPage, setNextPage] = useState<string>("")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")
  const [searchByNameValue, setSearchByNameValue] = useState<string>("")
  const [isSearchReady, setIsSearchReady] = useState(false)
  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search))

  // --- FUNCTIONS: ---  

  // --- Searchbar functions: ---
  const handleUpdateSearchValue = (searchValue: string) => {
    setSearchByNameValue(searchValue)
  }

  const handleEnterKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      urlParams.set("name", searchByNameValue)
      setIsSearchReady(true)
    }
  }

  // --- Card Active State functions: ---
  const updateActiveCardsFunc = (isActive: boolean, listKey: number): void => {
    if (isActive) setActiveCards([...activeCards, listKey])
    if (!isActive) setActiveCards(activeCards.filter((card) => card !== listKey))  
  }

  const resetActiveCards = () => {
    setActiveCards([])
    setCharacters([])
  }

  // --- Pagination functions: ---
  const setNewPage = (page: string): void => {
    urlParams.set("page", page)
  }
 
  const turnPageBack = (): void => {
    resetActiveCards()
    setNewPage(String(currentPage-1))   
    fetchWithQuery(urlParams)    
    if (currentPage > 1) setCurrentPage(currentPage-1) // prevents going to the end of the list from page 1
  }

  const turnPageNext = (): void => {
    resetActiveCards()
    const regex = /page=(\d+)/;
    const match = nextPage.match(regex)
    if (match) {
      if (Number(match[1]) !== 1) { // prevents reverting back to first page from last page of the list
        setNewPage(match[1])        
        fetchWithQuery(urlParams)
        setCurrentPage(currentPage+1)
      } 
    }    
  }

  // --- Fetch function: ---
  const fetchWithQuery = async(urlParams: any, shouldPageBeReset?: boolean) => {
    if (shouldPageBeReset) {await urlParams.delete("page")}
    let url = `https://rickandmortyapi.com/api/character/?${urlParams}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      setError(data.error)
      return
    }    

    setCharacters(data.results)
    setNextPage(data.info.next ?? "")
    setReady(true)
  }

  // --- Search Bar trigger effect: ---
  useEffect( () => {
    if (isSearchReady) {
      resetActiveCards()
      fetchWithQuery(urlParams, true)
      setCurrentPage(Number(urlParams.get("page")) || 1)
      setIsSearchReady(false)
      setSearchByNameValue("")
    }    
  }, [isSearchReady])

  // --- First API call after website loads ---
  useEffect(() => {
    setCurrentPage(Number(urlParams.get("page")) || 1)
    fetchWithQuery(urlParams)
    setReady(true)    
  }, [])

  return(
    <div className="container characters-page--container">
      <CharacterSearch handleEnterKeyDown={handleEnterKeyDown} handleUpdateSearchValue={handleUpdateSearchValue} />
      {ready && <>
        <div className="characters-page__active-counter">
          <p className="characters-page--active-counter--page-text">Page: {currentPage}</p>
          <p className="characters-page--active-counter--text">Cards active: <span>{activeCards.length}</span></p>
        </div>
        <div className="characters-page">
          <ul className="characters-list">
            {characters.map( (character, id) => {
              return(
                <li key={id} className="characters-list__item">
                  <CharacterCard 
                    character={character} 
                    handleActiveCard={updateActiveCardsFunc} 
                    listKey={id}
                    appBounds={appBounds}
                  /> 
                </li>
              )
            })}
            {characters.length < 20 && <p style={{display: "block", width: "100%", margin: "50px"}}>No more results available.</p>}
          </ul>
        </div>    
      </>}
      {!ready && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="characters-page--buttons">
        <PaginationButton nextPage={false} handleClick={turnPageBack} />
        <PaginationButton nextPage={true} handleClick={turnPageNext} />
      </div>  
    </div>
  )
}