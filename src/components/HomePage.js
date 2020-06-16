import React, { useState, useEffect } from "react";
import "./HomePage.css";

import ImageGallery from "./ImageGallery";
import SearchImage from "./SearchImage";

import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPictures, searchPictures } from "../graphql/queries";
import { updatePicture, deletePicture } from "../graphql/mutations";
import {
  newOnCreatePicture,
  newOnUpdatePicture,
  newOnDeletePicture,
} from "../graphql/subscriptions";

function HomePage(props) {
  const [images, setImages] = useState([]);
  const [picture, setPicture] = useState();

  const getAllImagesToState = async () => {
    const result = await API.graphql(graphqlOperation(listPictures));
    let imageArray = await buildImageArray(result.data.listPictures.items);
    setImages(imageArray);
  };

  useEffect(() => {
    getAllImagesToState();
  }, [picture]);

  let subscriptionOnCreate;
  let subscriptionOnDelete;
  let subscriptionOnUpdate;

  function setupSubscriptions() {
    subscriptionOnCreate = API.graphql(
      graphqlOperation(newOnCreatePicture)
    ).subscribe({
      next: (picturesData) => {
        setPicture(picturesData);
      },
    });

    subscriptionOnDelete = API.graphql(
      graphqlOperation(newOnDeletePicture)
    ).subscribe({
      next: (picturesData) => {
        setPicture(picturesData);
      },
    });

    subscriptionOnUpdate = API.graphql(
      graphqlOperation(newOnUpdatePicture)
    ).subscribe({
      next: (picturesData) => {
        setPicture(picturesData);
      },
    });
  }

  useEffect(() => {
    setupSubscriptions();

    return () => {
      subscriptionOnCreate.unsubscribe();
      subscriptionOnDelete.unsubscribe();
      subscriptionOnUpdate.unsubscribe();
    };
  }, []);

  const buildImageArray = async (listPictures) => {
    return await getImagesFileList(listPictures);
  };

  const getImagesFileList = async (imageList) => {
    return Promise.all(
      imageList.map(async (i) => {
        return getOneFormatedImage(i);
      })
    );
  };

  const getOneFormatedImage = async (image) => {
    return {
      src: await Storage.get(image.file.key),
      id: image.id,
      labels: image.labels,
    };
  };

  const deleteImage = async (imageId) => {
    const id = {
      id: imageId,
    };
    try {
      await API.graphql(graphqlOperation(deletePicture, { input: id }));
      console.log(images);

      const i = images.filter((value, index, arr) => {
        return value.id !== imageId;
      });
      setImages(i);
    } catch (error) {
      console.log(error);
      alert("Cannot delete: User doesn't own this image");
    }
  };

  const addTagImage = async (imageId, tagValue) => {
    // First i need all the tags for that image
    const image = images.filter((value, index, arr) => {
      return value.id === imageId;
    });

    let labels = image[0].labels;
    labels.push(tagValue);

    const input = {
      id: imageId,
      labels: labels,
    };

    try {
      await API.graphql(graphqlOperation(updatePicture, { input: input }));

      //Then I need to refresh the state with the new tag
      await getAllImagesToState();
    } catch (error) {
      console.log(error);
      alert("Cannot edit: User doesn't own this image");
    }
  };

  const searchImage = async (searchLabel) => {
    var result;

    // when no search filter is passed, revert back to full list
    if (searchLabel.label == "") {
      await getAllImagesToState();
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
        let imageArray = await buildImageArray(
          result.data.searchPictures.items
        );
        setImages(imageArray);
      } else {
        setImages([]);
      }
    }
  };

  return (
    <div className="HomePage">
      <div>
        <h1> Image Gallery</h1>
      </div>
      <SearchImage searchImage={searchImage} />
      <ImageGallery
        images={images}
        deleteImage={deleteImage}
        addTagImage={addTagImage}
      />
    </div>
  );
}

export default HomePage;
