

import './PaginationButton.css'

type ButtonProps = {
  nextPage: boolean,
  handleClick: () =>  void
}

export const PaginationButton = ({nextPage, handleClick}: ButtonProps) => {

  return(
    <button
      className="button button--pagination"
      onClick={handleClick}
    >
      {nextPage ? "Next" : "Back"}
    </button>
  )
}