import './App.css';
import Navigation from './components/Navigation/Navigation';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import { Component } from 'react';

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
   }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  render() {

    return (
      <div className="App">
        <Particles className="particles"
        params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm  onInputChange ={this.onInputChange}/>
        {/* {
  
        <FaceRecogniton  />} */}
  
      </div>
    );

  }
  
}

export default App;
