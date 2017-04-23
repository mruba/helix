import React, { Component } from 'react';
import logo from './helix-logo.png';
import './App.css';
import Webcam from 'react-webcam';
import AWSUtils from './AWSUtils'

class App extends Component {

  constructor(props) {
      super(props)
      // our state is simple--it just holds a message
      // to display to the user and a spinner bool
      this.state = {
          messageText: null,
          spinning: false
      }
      this.handleMessage = this.handleMessage.bind(this)
      this.setSpinner = this.setSpinner.bind(this)
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

  takePicture(){
    const screenshot = this.refs.webcam.getScreenshot();
    // this.setSpinner(true)
    let aws = new AWSUtils()
    this.handleMessage("Getting photo...")
    console.log("Matching the face...")
    this.handleMessage("Matching face...")
    function dataURItoBlob(dataURI) {
        if(typeof dataURI !== 'string'){
            throw new Error('Invalid argument: dataURI must be a string');
        }
        dataURI = dataURI.split(',');
        var type = dataURI[0].split(':')[1].split(';')[0],
            byteString = atob(dataURI[1]),
            byteStringLength = byteString.length,
            arrayBuffer = new ArrayBuffer(byteStringLength),
            intArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteStringLength; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([intArray], {
            type: type
        });
    }

    aws.matchFace(dataURItoBlob(screenshot), this.handleMessage, this.setSpinner)
  }

  captureButton(){
      if(!this.state.spinning){
        return (
          <div className="Button" onClick={this.takePicture.bind(this)}>
            Press Me!
          </div>)
      }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
          <Webcam screenshotFormat={'image/png'} className="Webcam" ref="webcam" audio={false}/>
        </div>
          {this.captureButton()}
      </div>
    );
  }
}



export default App;
