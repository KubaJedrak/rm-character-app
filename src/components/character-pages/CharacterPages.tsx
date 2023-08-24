import { useEffect, useState, useRef } from "react"
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
  const [activeCards, setActiveCards] = useState<number[]>([]) 
  const [characters, setCharacters] = useState([])
  const [info, setInfo] = useState<Info>()
  const [previousPage, setPreviousPage] = useState<string>("")
  const [nextPage, setNextPage] = useState<string>("")
  const [ready, setReady] = useState(false)
  const [error, setError] = useState("")
  const [searchByNameValue, setSearchByNameValue] = useState<string>()
  const [isSearchReady, setIsSearchReady] = useState(false)

  const urlParams = new URLSearchParams(window.location.search);
  const nameSearchParam: string = urlParams.get('name') ?? "";
  const pageSearchParam: string = urlParams.get('page') ?? ""
 

  // --- FUNCTIONS: --- 
  const handleUpdateSearchValue = (searchValue: string) => {
    setSearchByNameValue(searchValue)
  }

  const handleEnterKeyDown = (e: any): void => {
    if (e.key === "Enter") {
      setIsSearchReady(true)
    }
  }

  const updateActiveCardsFunc = (isActive: boolean, listKey: number): void => {     // some bug here on backing up??
    if (isActive) {
      setActiveCards([...activeCards, listKey])
    }
    if (!isActive) setActiveCards(activeCards.filter((card) => card !== listKey))  
  }

  // reset active cards
  const resetActiveCards = () => {
    setActiveCards([])
    setCharacters([])
  }

  const turnPageBack = (): void => {
    resetActiveCards()
    fetchWithQuery(previousPage)    
    if (currentPage > 1) setCurrentPage(currentPage-1)
  }

  const turnPageNext = (): void => {
    resetActiveCards()
    const regex = /page=(\d+)/;
    const match = nextPage.match(regex)
    if (match) {
      if (Number(match[1]) !== 1) {
        fetchWithQuery(nextPage)
        setCurrentPage(currentPage+1)
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
    setReady(true) 
  }

  // --- Search Bar trigger effect: ---
  useEffect( () => {
    if (isSearchReady) {
      fetchWithQuery(`https://rickandmortyapi.com/api/character/?name=${searchByNameValue}`)
      setIsSearchReady(false)
      setSearchByNameValue("")
    }    
  }, [isSearchReady])

  // --- First API call after website loads ---
  useEffect(() => {
    fetchWithQuery()
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
                  <CharacterCard character={character} handleActiveCard={updateActiveCardsFunc} listKey={id} /> 
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