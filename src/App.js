import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';

import { Component } from 'react';

const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '1e46172a5ab54decb37d709996d11f0d'
 });

const particlesOptions = {
  
    particles: {
      number: {
      value: 200,
      density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }

class App extends Component {
  
  constructor() {
   super();
   this.state = {
     input: '',  
     imageUrl: '',
     box: {}, // a new object state that hold the bounding_box value
   }
  }

  // this function calculate the facedetect location in the image

  calculateFaceLocation= (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height= Number(image.height);
   return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - clarifaiFace.right_col * width,
    bottomRow: height - clarifaiFace.bottom_row * height,
   };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });

  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }
  

  render() {

    return (
      <div className="App">
        <Particles className="particles"
        params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm  
          onInputChange= {this.onInputChange} 
          onButtonSubmit= {this.onButtonSubmit}
        />   
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
      </div>
    );

  }
  
}

export default App;
