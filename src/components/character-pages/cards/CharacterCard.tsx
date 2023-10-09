import { useEffect, useState, useRef, useCallback } from "react"
import './CharacterCard.css'

type CharacterData = {
  character: any,
  handleActiveCard: (isActive: boolean, characterID: number) => void,
  isCardActive: boolean,
  appBounds: DOMRect | null,
  tooltipDataFunc: (episodes: string[], isVisible: boolean, positionLeft: string, positionTop: string) => void 
}

export const CharacterCard = ({character, handleActiveCard, isCardActive ,appBounds, tooltipDataFunc}: CharacterData) => {

  const [isActive, setIsActive] = useState(isCardActive)
  const [containerClass, setContainerClass] = useState("")
  const [episodeIDs, setEpisodeIDs] = useState<string[]>([])
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
    tooltipDataFunc(episodeIDs, true, positionLeft, positionTop)
  }

  const handleMouseOut = (): void => {
    tooltipDataFunc([], false, "0", "0")
  }
  
  // --- Tooltip Positioning: ---
  const updateElementPosition = useCallback(() => {
    const targetElement = targetElementRef.current
    let appWidth = 0
    if (appBounds) appWidth = appBounds.width

    if (targetElement) {
      const elementBounds = targetElement.getBoundingClientRect()
      const padding = 20
      const maxWidthOfTooltip = 325
      const totalWidthWithTootltip = elementBounds.left + elementBounds.width + padding + maxWidthOfTooltip

      if (appWidth < 600) {
        setPositionLeft(`${String(20)}%`)
        setPositionTop(`${String(elementBounds.top + padding + 30)}px`)
      } else if (totalWidthWithTootltip > appWidth) {
        setPositionLeft(`${String(elementBounds.left + elementBounds.width + padding - maxWidthOfTooltip)}px`)
        setPositionTop(`${String(elementBounds.top + padding)}px`)
      } else {
        setPositionLeft(`${String(elementBounds.left + elementBounds.width + padding)}px`)
        setPositionTop(`${String(elementBounds.top + padding)}px`)
      }
    }
  }, [appBounds])

  //   -- Card Active CSS trigger & Active Count (in Pages) update --
  useEffect( () => {
    if (isActive) {
      handleActiveCard(isActive, character.id)
    } else {
      handleActiveCard(isActive, character.id)
    }
  }, [isActive, character.id])

  // update active cards on pagination from activeCards array
  useEffect(() => {
    if (isCardActive) setContainerClass("card characters-page__card active")
    if (!isCardActive) setContainerClass("card characters-page__card")
  }, [isCardActive])

  //   -- Tooltip Positioning Effect --
  useEffect(() => {    
    updateElementPosition();
    window.addEventListener('scroll', updateElementPosition)
    window.addEventListener('resize', updateElementPosition)
    
    return () => {
      window.removeEventListener('scroll', updateElementPosition);
      window.removeEventListener('resize', updateElementPosition);
    }
  }, [updateElementPosition])

  return(
    <div className={containerClass} onClick={handleCardClick}>
      <div className="card__image--container">
        <img className="card__img" alt={`A portrait of the character ${name}`} src={image} />
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
          Number of episodes: <p 
            className="card__info--text card__info--tooltip-text"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            id={`card-${id}`}
          >{episodes.length}</p>
        </div>
      </div>
    </div>
  )
}