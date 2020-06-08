import React, { Component } from "react";

class SearchImage extends Component {
  constructor(props) {
    super(props);
    this.state = { label: "" };
  }

  handleChange = (event) => {
    this.setState({ label: event.target.value });
  };

  handleClick = (event) => {
    event.preventDefault();

    // let the app manage the persistence & state
    this.props.searchImage(this.state);
  };

  render() {
    return (
      <div className="container">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search for images"
            aria-label="Label"
            aria-describedby="basic-addon2"
            value={this.state.label}
            onChange={this.handleChange}
          />
          <div className="input-group-append">
            <button
              onClick={this.handleClick}
              className="btn btn-primary"
              type="submit"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchImage;
