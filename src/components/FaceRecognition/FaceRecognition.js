import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    return(
       <div className='center'>
           <img alt='' src={imageUrl}/>
       </div>
    );
}

//https://samples.clarifai.com/face-det.jpg

export default FaceRecognition;