import React, { Component } from 'react';

class ImageGallery extends Component {
    constructor(props) {
        super(props);
    }
    
    handleChange = (e) => {  
        console.log(e.target);
    }

    render() {
        console.log(this.props.images);
        return (
        <React.Fragment>
            <div className="container">
            { this.props.images.map( (image) => 
            <div key={image.id} className="border border-primary rounded p-3 m-3">
                <img src={image.src} alt="Smiley face"  width="300"/>
                <div>{image.labels.join(', ')}</div>
            </div>
            )}
            </div>
        </React.Fragment>
        )
    }       
}

export default ImageGallery;

