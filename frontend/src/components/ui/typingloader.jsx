import React from 'react'

const TypingLoader = ({className}) => {
  return (
    //not me!!, from Uiverse.io by aaronross1
    <div className={`typing-indicator ${className}`}>
        <div className="typing-circle"></div>
        <div className="typing-circle"></div>
        <div className="typing-circle"></div>
        <div className="typing-shadow"></div>
        <div className="typing-shadow"></div>
        <div className="typing-shadow"></div>
    </div>
  )
}

export default TypingLoader;