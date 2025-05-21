import React from 'react'
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'

const Rating = ({total, rating}) => {
    return (<Rater total={total} rating={rating} />)
}

export default Rating