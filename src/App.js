import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Axios from 'axios';

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
      imageUrl: ``,
      box:{},
      route: 'signin',
      isSignedIn: false,
      boxes:{},
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      }})
  }

  calculateFaceLocation = (data) => {
    const regions = data.outputs[0].data.regions;
    //const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    let faces = [];
    for(let region of regions) {
      let face = region.region_info.bounding_box;
      faces.push( {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height),
        });
    }

    return faces;

    // return {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height),
    //   }
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes})
  }
 
  onInputChange = (event) => {
    this.setState({input : event.target.value})
  }

  onImageSet = () => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
    .then(response =>{
      if(response){
        Axios.put('http://localhost:3000/image',
        {
          id: this.state.user.id
        })
        .then(res => res.data)
        .then(count => {
          //pake Object.assign supaya name di user gak berubah, copy dari parameter kanan ke kiri(target)
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBoxes(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
  }

  onPictureSubmit= () => {
    //this is set state callback
    this.setState({imageUrl: this.state.input}, this.onImageSet); 
  }

  onRouteChange = (newRoute) => {
    if (newRoute==='signin' || newRoute==='register') {
      this.setState({isSignedIn: false})
    } else if (newRoute==='home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: newRoute});
  }
  
  render() {
    const { isSignedIn, imageUrl, route, boxes, user } = this.state;

    return (
      <div className="App">
        <Particles 
        className='particles'
        params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route==='home'
          ?<div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
          : (
              route==='signin'
              ?<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }        
      </div>
    );
  }
}

export default App;
