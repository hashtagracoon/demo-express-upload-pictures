import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {

  state = {
    selectedFiles: []
  };

  render() {
    return (
      <div className="App">
        <form ref='uploadForm'
          id='uploadForm'
          action='http://localhost:8000/upload'
          method='post'
          encType="multipart/form-data">
          <input type="file" name="img1" />
          <input type="file" name="img2" />
          <input type="file" name="img3" />
          <input type='submit' value='Upload' />
        </form>
      </div>
    );
  }
}
