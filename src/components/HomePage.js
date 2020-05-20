import React from 'react';
import './HomePage.css';

import ImageGallery from './ImageGallery';

import { Storage, API, graphqlOperation } from 'aws-amplify';
import { listPictures } from '../graphql/queries';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { 
          images:[]
          }
    }

    async componentDidMount(){
        const result = await API.graphql(graphqlOperation(listPictures));
        let imageArray = await this.buildImageArray(result.data.listPictures.items);
        this.setState( { images: imageArray } )
    }
    
    async buildImageArray (listPictures) {
        return await this.getImagesFileList(listPictures);
    }

    async getImagesFileList (imageList) {
        return Promise.all(imageList.map(async i =>  {
            return this.getOneFormatedImage(i)
        }));
    }

    async getOneFormatedImage(image) {
        return {
            src: await Storage.get(image.file.key),
            id: image.id,
            labels: image.labels
        }
    }

    render() {
        return (
            <div className="HomePage">
                <div>Image Gallery</div>
                <ImageGallery images={this.state.images} />
            </div>
        )
    }
}

export default HomePage;

