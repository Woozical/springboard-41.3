import React from "react";
import './LoadSpinner.css';

class LoadSpinner extends React.Component{
  render(){
    return (
      <div>
        <p>Loading...</p>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>)
  }
}

export default LoadSpinner;