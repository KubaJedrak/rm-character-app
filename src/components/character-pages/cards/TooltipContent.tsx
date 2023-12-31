import { useState, useEffect } from 'react'
import './CharacterCard.css'
import { LoaderCircular } from '../../loader/loader'

type ContentParams = {
  episodeIDs: string[],
  visible: boolean,
  top: string,
  left: string,
}

type SeasonObject = {season: string, seasonalEpisodes: string[]}

export const TooltipContent = ({episodeIDs, visible, left, top}: ContentParams) => {

  const [error, setError] = useState<any>(null)
  const [tooltipData, setTooltipData] = useState<Array<SeasonObject>>([
    {season: "01", seasonalEpisodes: []}, {season: "02", seasonalEpisodes: []}, {season: "03", seasonalEpisodes: []}, {season: "04", seasonalEpisodes: []}, {season: "05", seasonalEpisodes: []}, {season: "06", seasonalEpisodes: []}
  ])
  const [dataReady, setDataReady] = useState<boolean>(false) 
  
  const fetchEpisodes = async() => {
    setDataReady(false)
    const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIDs}`)
    const data = await response.json()

    let episodes: string[] = []
    
    if (Array.isArray(data)) {
      data.forEach(episode => {
        episodes.push(episode.episode);        
      })
    } else {
      episodes = [data.episode]
    }

    let tempArray: Array<SeasonObject> = [
      {season: "01", seasonalEpisodes: []},
      {season: "02", seasonalEpisodes: []}, 
      {season: "03", seasonalEpisodes: []}, 
      {season: "04", seasonalEpisodes: []}, 
      {season: "05", seasonalEpisodes: []}, 
      {season: "06", seasonalEpisodes: []}
    ]

    episodes.forEach((episode) => {      
      const regex = /S(\d+)E(\d+)/
      const match = episode.match(regex)

      if (match) {        
        const season = match[1]        
        const episodeNumber = match[2]      
      
        tempArray.forEach( entry => {          
          if (entry.season === season) {            
            if (!entry.seasonalEpisodes.includes(episodeNumber)) entry.seasonalEpisodes.push(episodeNumber) // why did it keep doubling it?! 
          }
        })
      }
    })   

    if (data.error) {
      setError(data.error)
      return
    }

    setTooltipData(tempArray)
  } 

  useEffect(() => {
    fetchEpisodes()
    setDataReady(true)
  }, [])

  return(
    <div 
      className={`tooltip--container ${visible ? "visible" : ""}`}
      style={{top: `${top}`, left: `${left}`}}
    >
      {dataReady && <>
        { tooltipData.map( (season, id): any => {
          if (season.seasonalEpisodes.length > 0) {
            return(
              <div key={id}>
                <p>Season {season.season}</p>
                <p className="tooltip--text">Episodes: {season.seasonalEpisodes.join(', ')}</p>
              </div>
            )
          }
        })}
        {error && <p>Sorry, couldn't access this information</p>}
      </>}
      {!dataReady && <LoaderCircular />}
    </div>
  )
}