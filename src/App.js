import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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

const initialState = {
  input: '',  
  imageUrl: '',
  boxes: [], // a new object state that hold the bounding_box value
  route: 'signin',
  isSignedIn : false,
  user: {
  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: ''
  }
}

class App extends Component {
  
  constructor() {
    super();
    this.state = initialState; 
}

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  

  // this function calculate the facedetect location in the image
  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height= Number(image.height);

    const boxes = data.outputs[0].data.regions.map(box => {
      const clarifaiFace = box.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width, 
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      }
    })

    return boxes;
  }


  displayFaceBox = (box) => {
    this.setState({ boxes: box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://murmuring-lowlands-94757.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
     console.log('Image received ', response)
    if (response) {
      fetch('https://murmuring-lowlands-94757.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
  .catch(err => console.log(err));
}


  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    } else if ( route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
  

  render() {
    const { isSignedIn, imageUrl, route, boxes} = this.state;

    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

        {this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} 
            />
            <ImageLinkForm  
                onInputChange= {this.onInputChange} 
                onPictureSubmit= {this.onPictureSubmit}
            />   
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} /> 
            </div>
        : (
            route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange= {this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange= {this.onRouteChange} />
          )    
    }
  
    </div>
    );

  }
  
}

export default App;
