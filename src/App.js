import React, { Component } from 'react';
import logo from './helix-logo.png';
import './App.css';
import Webcam from 'react-webcam';
import AWSUtils from './AWSUtils';
import Loader from 'halogen/RiseLoader';
import v4 from 'uuid/v4'


class App extends Component {

  constructor(props) {
      super(props)
      // our state is simple--it just holds a message
      // to display to the user and a spinner bool
      this.state = {
          messageText: null,
          spinning: false,
          visibleElement: 'webcam',
          recommendations: null
      }
      this.handleRecommendations = this.handleRecommendations.bind(this)
      this.handleMessage = this.handleMessage.bind(this)
      this.setSpinner = this.setSpinner.bind(this)
      this.setVisibleElement = this.setVisibleElement.bind(this)
      this.resetAllStates = this.resetAllStates.bind(this)
  }

  handleRecommendations(recommendations){
    this.setState({
      recommendations: recommendations
    })
  }

  handleMessage(messageText) {
      this.setState({
          messageText: messageText
      })
  }

  // ...and this one to handle the spinner...
  setSpinner(spinning) {
      this.setState({
          spinning: spinning
      })
  }

  setVisibleElement(element, recommendations = []){
    this.setState({
      visibleElement: element,
      recommendations: recommendations
    })
  }

  takePicture(){
    this.setSpinner(true)
    this.setVisibleElement('spinner')
    const screenshot = this.refs.webcam.getCanvas();

    let aws = new AWSUtils()
    this.handleMessage("Getting photo...")

    this.handleMessage("Sending to AWS Rekognition's API face search endpoint...")
    var dataURL = screenshot.toDataURL('image/png');
    let base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

    aws.matchFace(base64, this.handleMessage, this.setSpinner, this.setVisibleElement, this.handleRecommendations, this.resetAllStates)
  }

  resetAllStates(){
    this.setState({
      messageText: null,
      spinning: false,
      visibleElement: 'webcam',
      recommendations: null
    })
  }

  footerArea(){
      if(this.state.messageText){
        return(
          <div className="interface">
            <p>{this.state.messageText}</p>
          </div>
        )
      }else{
        return <div className="Button" onClick={this.takePicture.bind(this)}>Press Me!</div>
      }
  }

  mainVisualArea(){
    switch (this.state.visibleElement) {
      case 'webcam':
          return <Webcam  screenshotFormat={'image/png'} className="Webcam" ref="webcam" audio={false}/>
        break;
      case 'spinner':
        return (<div className="LoaderWraper">
                  <Loader color="#a4c722" size="60px" margin="4px"/>
                </div>)
        break;
      case 'recommendations':
        return(
          <div>
            {this.state.recommendations.map(chunk => (
              <div key={v4()} className='chunkConteiner'>
                <div  className="product" key={chunk[0].id}>
                  <img src={chunk[0].imgSrc} />
                  <p>{chunk[0].name}</p>
                  <p>{chunk[0].description}</p>
                  <p>{chunk[0].price}</p>
                </div>
                <div  className="product" key={chunk[1].id}>
                  <img src={chunk[1].imgSrc} />
                  <p>{chunk[1].name}</p>
                  <p>{chunk[1].description}</p>
                  <p>{chunk[1].price}</p>
                </div>
                <div  className="product" key={chunk[2].id}>
                  <img src={chunk[2].imgSrc} />
                  <p>{chunk[2].name}</p>
                  <p>{chunk[2].description}</p>
                  <p>{chunk[2].price}</p>
                </div>
              </div>
            ))}
            <div className="Button" onClick={this.resetAllStates}>Try Again!</div>
          </div>
        )
        break;
      default:
        return <Webcam  screenshotFormat={'image/png'} className="Webcam" ref="webcam" audio={false}/>
    }
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <div className="camWraper">
          {this.mainVisualArea()}
          {/* {this.interactionArea()} */}
        </div>

        <div className="ButtonWraping">
          {this.footerArea()}
        </div>


      </div>
    );
  }
}



export default App;
