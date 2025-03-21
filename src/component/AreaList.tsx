import { FC } from "react"

type AreaListProps = {
  allAreas?: string[],
  answeredAreas: {[key: string]: "wrong" | "correct"}
}

const AreaList: FC<AreaListProps> = ({allAreas, answeredAreas}) => {
  return(
    <ol className='list-decimal list-inside sm:columns-2 text-left'>
      {Object.keys(answeredAreas).length === 0 ? (
        allAreas?.map((name, index) => (<li className='text-black font-medium text-base md:text-lg' key={index}>{name}</li>))
      ) : 
      Object.keys(answeredAreas).map((key, index) => (
        <li className={`${answeredAreas[key] === "wrong" ? 'text-red-600' : answeredAreas[key] === "correct" ? 'text-green-600' : 'text-black' } font-medium`} key={index}>{key}</li>
      ))}
    </ol>
  )
}

export default AreaList