import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: '6ecdf7e8430d4b3787ec56d9f73db2d1'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density : {
        enable: true,
        value_area: 500
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: ``,
      imageUrl: ``
    }
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value})
  }

  onImageSet = () => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
        // there was an error
      }
    );
  }

  onButtonSubmit = () => {
    //this is set state callback
    this.setState({imageUrl: this.state.input}, this.onImageSet); 
  }

  render() {
    return (
      <div className="App">
        <Particles 
        className='particles'
        params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
