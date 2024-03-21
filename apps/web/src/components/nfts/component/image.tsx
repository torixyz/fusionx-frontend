import { useState } from 'react'

const Image = (props) => {
  const [isError, setIsError] = useState(true)
  const defaultImg = '/images/default-error-img.png'
  const imgerrorfun = (event: any) => {
    if (isError) {
      setIsError(false)
      // eslint-disable-next-line no-param-reassign
      event.target.src = defaultImg
    }
  }
  return <img onError={imgerrorfun} alt="" {...props} />
}

export default Image
