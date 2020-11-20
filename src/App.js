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
     imageUrl: ''
   }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(
      function (response) {
        // response data fetch from FACE_DETECT_MODEL 
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        /* data needed from the response data from clarifai API, 
           note we are just comparing the two for better understanding 
           would to delete the above console*/  
      },
      function (err) {
        // there was an error
      }
    );
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
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );

  }
  
}

export default App;
