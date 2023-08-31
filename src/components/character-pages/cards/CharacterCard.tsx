import { useEffect, useState, useRef } from "react"
import { createPortal } from 'react-dom';
import { TooltipContent } from "./TooltipContent"
import './CharacterCard.css'

type CharacterData = {
  character: any, 
  handleActiveCard: (isActive: boolean, listKey: number) => void,
  listKey: number,
  appBounds: any
}

type EpisodeIDs = string[]

export const CharacterCard = ({character, handleActiveCard, listKey, appBounds}: CharacterData) => {

  const [isActive, setIsActive] = useState(false)
  const [containerClass, setContainerClass] = useState("")
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [episodeIDs, setEpisodeIDs] = useState<EpisodeIDs>([])
  const [positionLeft, setPositionLeft] = useState<string>("")
  const [positionTop, setPositionTop] = useState<string>("")
  const {id, image, name, status, episode: episodes} = character
  const targetElementRef = useRef<any>(null)
  const regex = /[a-zA-Z0-9._%+-]+\/(\d+)$/ 

  episodes.forEach( (episode: string) => {
    const match = episode.match(regex)   
    
    if (match) {
      const episodeID = match[1]   
      if (!episodeIDs.includes(episodeID)) episodeIDs.push(episodeID)     
    }    
  })

  // ----- FUNCTIONS: -----
  
  // --- Card Active Funcs: ---
  const handleCardClick = (): void => {
    setIsActive(!isActive)
  }

  // --- Tooltip Funcs: ---
  const handleMouseOver = (): void => {
    setIsTooltipVisible(true)
  }

  const handleMouseOut = (): void => {
    setIsTooltipVisible(false)
  }
  
  // --- Tooltip Positioning: ---
  const updateElementPosition = () => {
    const targetElement = targetElementRef.current
    if (targetElement) {
      const elementBounds = targetElement.getBoundingClientRect()
      const padding = 20
      const maxWidthOfTooltip = 325
      const totalWidthWithTootltip = elementBounds.left + elementBounds.width + padding + maxWidthOfTooltip

      if (appBounds.width < 600) {
        setPositionLeft(`${String(20)}%`)
        setPositionTop(`${String(elementBounds.top + padding + 30)}px`)
      } else if (totalWidthWithTootltip > appBounds.width) {
        setPositionLeft(`${String(elementBounds.left + elementBounds.width + padding - maxWidthOfTooltip)}px`)
        setPositionTop(`${String(elementBounds.top + padding)}px`)
      } else {
        setPositionLeft(`${String(elementBounds.left + elementBounds.width + padding)}px`)
        setPositionTop(`${String(elementBounds.top + padding)}px`)
      }
    }
  }

  //   -- Card Active CSS trigger & Active Count (in Pages) update --
  useEffect( () => {
    if (isActive) { 
      setContainerClass("card characters-page__card active")
      handleActiveCard(isActive, listKey)
    } else {
      setContainerClass("card characters-page__card")
      handleActiveCard(isActive, listKey)
    }
  }, [isActive])

  //   -- Tooltip Positioning Effect --
  useEffect(() => {
    updateElementPosition();
    window.addEventListener('scroll', updateElementPosition)
    window.addEventListener('resize', updateElementPosition)
    
    return () => {
      window.removeEventListener('scroll', updateElementPosition);
      window.removeEventListener('resize', updateElementPosition);
    }
  }, [])

  return(
    <div className={containerClass} onClick={handleCardClick}>
      <div className="card__image--container">
        <img className="card__img" src={image} />
      </div>
      <div className='card__info'>
        <h5>{name}</h5>
        <p className="card__info--text">
          Status: <span className="card__info--text card__info--normal-text">{status}</span>
        </p>
        <div 
          className="card__info--text tooltip"
          ref={targetElementRef}          
        >
          Number of episodes: <a 
            className="card__info--text card__info--tooltip-text"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            id={`card-${id}`}
          >{episodes.length}</a>
          {createPortal(
          <TooltipContent 
            episodeIDs={episodeIDs}
            visible={isTooltipVisible} 
            top={`${positionTop}`}
            left={`${positionLeft}`}
          />, document.body, id)}
        </div>
      </div>
    </div>
  )
}