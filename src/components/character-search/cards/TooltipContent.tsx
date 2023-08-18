import './CharacterCard.css'

type ContentParams = {
  episodeInfo: string[],
  visible: boolean,
  top: string,
  left: string
}
type Season = string[]

export const TooltipContent = ({episodeInfo, visible, left, top}: ContentParams) => {

  // console.log("Episode info: ", episo  

  let seasons: string[][] = [[], [], [], [], [], []]
    
  episodeInfo.forEach( (episode) => {
    if (Number(episode) >= 0 && Number(episode) <= 11) {
      seasons[0].push(episode)
    }
    if (Number(episode) >= 12 && Number(episode) <= 21) {
      seasons[1].push(episode)
    }
    if (Number(episode) >= 22 && Number(episode) <= 31) {
      seasons[2].push(episode)
    }
    if (Number(episode) >= 32 && Number(episode) <= 41) {
      seasons[3].push(episode)
    }
    if (Number(episode) >= 42 && Number(episode) <= 51) {
      seasons[4].push(episode)
    }
    if (Number(episode) > 52) {
      seasons[5].push(episode)
    }
  })

  seasons.forEach((season: string[], i: number): void => {
    season.forEach((episode: string, i: number, season: string[]): void => {
      season[i] = "Episode " + season[i]
    })
  }) 

  return(
    <div 
      className={`tooltip--container ${visible ? "visible" : ""}`}
      style={{top: `${top}`, left: `${left}`}}
    >
      {seasons.map( (season: string[], id: number): any => {
        if (season.length > 0) {
          return (
            <div key={id}>
              <h4>{`Season ${id+1}`}</h4>
              {season.map( (episode: string, id: number): any => {                
                return(
                  <p className="tooltip--text" key={id}>{episode}</p>
                )
              })}
            </div>
          )
        }
      })}
    </div>
  )
}