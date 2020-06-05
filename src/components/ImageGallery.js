import React, { Component } from "react";

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageId: null,
      tagInputValue: "",
    };
  }

  handleTagInputChange = (e) => {
    this.setState({ tagInputValue: e.target.value });
  };

  onAddTagClick = (imageId) => {
    this.setState({ imageId: imageId });
  };

  render() {
    console.log(this.props.images);
    return (
      <React.Fragment>
        <div className="container">
          {this.props.images.map((image) => (
            <div
              key={image.id}
              className="img-container border border-primary rounded p-3 m-3"
            >
              <button
                type="button"
                className="delete-btn"
                onClick={(event) => {
                  this.props.deleteImage(image.id);
                }}
              >
                &times;
              </button>

              <img src={image.src} alt="Smiley face" width="300" />

              <div className="img-label-container">
                {image.labels.map((label) => (
                  <div className="img-label">{label}</div>
                ))}
              </div>

              <div className="add-tag-container">
                {this.state.imageId !== image.id && (
                  <button
                    type="button"
                    className="add-tag-btn"
                    onClick={() => this.onAddTagClick(image.id)}
                  >
                    Add tag &#43;
                  </button>
                )}
                {this.state.imageId === image.id && (
                  <React.Fragment>
                    <input
                      type="text"
                      placeholder="Tag name"
                      className="add-tag-input"
                      onChange={this.handleTagInputChange}
                    />
                    <button
                      type="button"
                      className="add-tag-confirm"
                      disabled={this.state.tagInputValue.length === 0}
                      onClick={(event) => {
                        this.props.addTagImage(
                          image.id,
                          this.state.tagInputValue
                        );
                      }}
                    >
                      Add
                    </button>
                  </React.Fragment>
                )}
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default ImageGallery;
