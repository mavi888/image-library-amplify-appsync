import React from "react";
import "./HomePage.css";

import ImageGallery from "./ImageGallery";
import SearchImage from "./SearchImage";

import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await this.buildImageArray(result.data.listPictures.items);
    this.setState({ images: imageArray });
  };

  async componentDidMount() {
    await this.getAllImagesToState();
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

  addTagImage = async (imageId, tagValue) => {
    console.log("home page");
    console.log(imageId);
    console.log(tagValue);

    // First i need all the tags for that image
    const image = this.state.images.filter((value, index, arr) => {
      return value.id === imageId;
    });

    let labels = image[0].labels;
    labels.push(tagValue);

    const input = {
      id: imageId,
      labels: labels,
    };
    await API.graphql(graphqlOperation(updatePicture, { input: input }));

    //Then I need to refresh the state with the new tag
    await this.getAllImagesToState();
  };

  searchImage = async (searchLabel) => {
    var result;

    // when no search filter is passed, revert back to full list
    if (searchLabel.label == "") {
      await this.getAllImagesToState();
    } else {
      // search
      const filter = {
        labels: {
          match: {
            labels: searchLabel,
          },
        },
      };

      result = await API.graphql(
        graphqlOperation(searchPictures, { filter: filter })
      );

      if (result.data.searchPictures.items.length > 0) {
        let imageArray = await this.buildImageArray(
          result.data.searchPictures.items
        );
        this.setState({ images: imageArray });
      } else {
        this.setState({
          images: [],
        });
      }
    }
  };

  render() {
    return (
      <div className="HomePage">
        <div>
          <h1> Image Gallery</h1>
        </div>
        <SearchImage searchImage={this.searchImage} />
        <ImageGallery
          images={this.state.images}
          deleteImage={this.deleteImage}
          addTagImage={this.addTagImage}
        />
      </div>
    );
  }
}

export default HomePage;
