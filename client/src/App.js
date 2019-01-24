import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {

  state = {
    selectedFiles: {},
    progress: 0
  };

  handleSelectedFile = (event) => {
    this._handleSelectedFile(event.target.name, event.target.files[0]);
  }

  _handleSelectedFile = (entry, file) => {
    console.log(entry, file);
    let selectedFiles = { ...this.state.selectedFiles };
    selectedFiles[entry] = file;
    this.setState({ selectedFiles }, () => {
      console.log(this.state.selectedFiles);
    });
    this.setState({
      progress: 0
    });
  }

  handleUpload = () => {
    const data = new FormData();
    for(const entry in this.state.selectedFiles) {
      if(this.state.selectedFiles.hasOwnProperty(entry)) {
        console.log(entry, this.state.selectedFiles[entry]);
        data.append(
          entry,
          this.state.selectedFiles[entry],
          this.state.selectedFiles[entry].name
        );
      }
    }

    axios.post(
      '/upload',
      data,
      {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          })
        },
      }
    ).then(res => {
      console.log(res);
    });

  }

  render() {
    return (
      <div className="App">
          <input type="file" name="img1" onChange={ this.handleSelectedFile }/>
          <input type="file" name="img2" onChange={ this.handleSelectedFile }/>
          <input type="file" name="img3" onChange={ this.handleSelectedFile }/>
          <input type='submit' value='Upload' onClick={ this.handleUpload }/>
        <div>{ this.state.progress }</div>
      </div>
    );
  }
}
