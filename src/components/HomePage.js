import React from "react";
import "./HomePage.css";

import ImageGallery from "./ImageGallery";

import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures } from "../graphql/queries";
import { deletePicture } from "../graphql/mutations";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  async componentDidMount() {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await this.buildImageArray(result.data.listPictures.items);
    this.setState({ images: imageArray });
  }

  async buildImageArray(listPictures) {
    return await this.getImagesFileList(listPictures);
  }

  async getImagesFileList(imageList) {
    return Promise.all(
      imageList.map(async (i) => {
        return this.getOneFormatedImage(i);
      })
    );
  }

  async getOneFormatedImage(image) {
    return {
      src: await Storage.get(image.file.key),
      id: image.id,
      labels: image.labels,
    };
  }

  deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    await API.graphql(graphqlOperation(deletePicture, { input: id }));
    console.log(this.state.images);
    this.setState({
      images: this.state.images.filter((value, index, arr) => {
        return value.id !== imageId;
      }),
    });
  };

  render() {
    return (
      <div className="HomePage">
        <div>Image Gallery</div>
        <ImageGallery
          images={this.state.images}
          deleteImage={this.deleteImage}
        />
      </div>
    );
  }
}

export default HomePage;
