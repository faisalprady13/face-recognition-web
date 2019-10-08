import React from 'react';

const FaceRecognition = ({imageUrl}) => {
  return (
    <div className='center'>
      <img alt='displayed input' src ={imageUrl} width='500px' height='auto'/>
    </div>
  );
};

export default FaceRecognition;