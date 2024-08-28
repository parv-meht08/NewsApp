import React, { Component } from 'react'
import Loading from './Loading.gif'

const spinner = () => {
  return (
    <div className='container d-flex justify-content-center'>
      <img src={Loading} alt={Loading} />
    </div>
  )
}
export default spinner
