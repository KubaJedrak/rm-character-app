import { useCallback, useEffect, useState } from "react"
import { createPortal } from 'react-dom';
import { PaginationButton } from "../buttons/PaginationButton"
import { CharacterCard } from "./cards/CharacterCard"
import { TooltipContent } from "./cards/TooltipContent"
import { CharacterSearch } from "../character-search/CharacterSearch"
import './CharacterPages.css'

type AppBounds = {
  appBounds: DOMRect | null
}

interface Character {
  id: number, 
  image: string, 
  name: string, 
  status: string, 
  episode: string | string[]
}

export const CharacterPages = ({appBounds}: AppBounds) => {

  const [currentPage, setCurrentPage] = useState<number>(1) // starts at 1
  const [activeCards, setActiveCards] = useState<number[]>([]) 
  const [characters, setCharacters] = useState<Character[]>([])
  const [nextPage, setNextPage] = useState<string>("")
  const [ready, setReady] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [searchByNameValue, setSearchByNameValue] = useState<string>("")
  const [isSearchReady, setIsSearchReady] = useState<boolean>(false)
  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search))

  const [episodesToFetch,setEpisodesToFetch] = useState<string[]>([])
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false)
  const [positionLeft, setPositionLeft] = useState<string>("")
  const [positionTop, setPositionTop] = useState<string>("")

  const [appWidth, setAppWidth] = useState<number>(0)
  
  // --- FUNCTIONS: ---  

  const mouseMoveHandler = useCallback((event: { clientX: number; clientY: number; }) => {
    let appWidth = 0
    if (appBounds) appWidth = appBounds.width
    let maxTooltipWidth = 300

    if (appWidth < 600) {
      setPositionLeft(`20%`)      
    } else if (event.clientX + maxTooltipWidth > appWidth) {
      setPositionLeft(`${event.clientX - maxTooltipWidth - 15}px`)
    } else {
      setPositionLeft(`${event.clientX + 15}px`)
    }
    setPositionTop(`${event.clientY + 15}px`)
  }, [appBounds])

  // --- Searchbar functions: ---
  const handleUpdateSearchValue = (searchValue: string) => {
    setSearchByNameValue(searchValue)
  }

  const handleEnterKeyDown = (e: { key: string }): void => {
    if (e.key === "Enter") {
      urlParams.set("name", searchByNameValue)
      setIsSearchReady(true)
    }
  }

  // --- Card Active State functions: ---
  const updateActiveCardsFunc = useCallback((isActive: boolean, characterID: number): void => {
    if (isActive) { 
      if (!activeCards.includes(characterID)) setActiveCards([...activeCards, characterID]) // .includes prevents duplicate entries and incorrect increase of active cards counter after page change 
    }    
    if (!isActive) {
      setActiveCards(activeCards.filter((card) => card !== characterID))
    }  
  }, [activeCards])

  // --- Pagination functions: ---
  const setNewPage = (page: string): void => {
    urlParams.set("page", page)
  }
 
  const turnPageBack = (): void => {
    setCharacters([])
    setNewPage(String(currentPage-1))   
    fetchWithQuery(urlParams)    
    if (currentPage > 1) setCurrentPage(currentPage-1) // prevents going to the end of the list from page 1
  }

  const turnPageNext = (): void => {
    setCharacters([])
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

  const getTooltipData = (episodes: string[], isVisible: boolean) => {
    setEpisodesToFetch(episodes)
    setIsTooltipVisible(isVisible)
  }

  // --- Fetch function: ---
  const fetchWithQuery = async(urlParams: URLSearchParams, shouldPageBeReset?: boolean) => {
    if (shouldPageBeReset) {urlParams.delete("page")}
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
      setCharacters([])
      fetchWithQuery(urlParams, true)
      setCurrentPage(Number(urlParams.get("page")) || 1)
      setIsSearchReady(false)
      setSearchByNameValue("")
    }    
  }, [isSearchReady, urlParams])

  // --- First API call after website loads ---
  useEffect(() => {
    setCurrentPage(Number(urlParams.get("page")) || 1)
    fetchWithQuery(urlParams)
    setReady(true)    
  }, [urlParams])

  useEffect(() => {
    window.addEventListener('mousemove', mouseMoveHandler)

    return (() => {
      window.removeEventListener('mousemove', mouseMoveHandler)
    })    
  }, [isTooltipVisible])

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
            {characters.map( (character, index) => {             
              let isCardActive: boolean = (activeCards.includes(character.id) ? true : false)             

              return(
                <li key={index} className="characters-list__item">
                  <CharacterCard 
                    character={character} 
                    handleActiveCard={updateActiveCardsFunc} 
                    isCardActive={isCardActive}
                    tooltipDataFunc={getTooltipData}
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
      {isTooltipVisible && createPortal(
        <TooltipContent 
          episodeIDs={episodesToFetch}
          visible={isTooltipVisible} 
          top={positionTop}
          left={positionLeft}
        />, document.body)}
    </div>
  )
}