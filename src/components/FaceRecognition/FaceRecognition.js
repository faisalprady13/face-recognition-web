import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxes}) => {
  //change to array
  boxes = Array.from(boxes)
  let key = 0;
  
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto' />
        
        {boxes.map(box => {
          return <div className='bounding-box' key={key++} style={{top: box.topRow, right:box.rightCol, bottom:box.bottomRow, left: box.leftCol}}></div>
        })}

      </div>
    </div>
  );
};

export default FaceRecognition;