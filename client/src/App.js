import React, { Component } from 'react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';

export default class App extends Component {

  state = {
    pictures: [],
    progress: 0,
    message: '',
    warning: false
  };

  onDrop = (pictures) => {
    console.log(pictures);
    if(pictures.length > 3) {
      this.setState({
        pictures: [],
        message: 'Warning: You can only upload up to 3 pictures!',
        warning: true
      });
    }
    else {
      this.setState({
        pictures: pictures,
        message: '',
        warning: false
      });
    }
  }

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
      progress: 0,
      message: ''
    }, () => {
      console.log('reset to 0');
    });
  }

  handleUpload = () => {
    if(this.state.pictures.length === 0) return;

    const data = new FormData();
    for(let i = 0;i < this.state.pictures.length;i++) {
      console.log(i, this.state.pictures[i]);
      data.append(
        `img${i + 1}`,
        this.state.pictures[i],
        this.state.pictures[i].name
      );
    }

    axios.post(
      '/upload',
      data,
      {
        onUploadProgress: ProgressEvent => {
          this.setState({
            progress: Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100),
          }, () => {
            if(this.state.progress === 100) {
              this.setState({
                message: 'Upload Completed!'
              });
            }
          })
        },
      }
    ).then(res => {
      console.log(res);
    });

  }

  render() {
    return (
      <div>

        <nav>
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">Upload Pictures</a>
          </div>
        </nav>

        <div style={{ textAlign: 'center' }}>

          <ImageUploader
            withIcon={true}
            withPreview={true}
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            buttonStyles={{ backgroundColor: '#2bbbad' }}
          />

          <button class="btn waves-effect waves-light" type="submit" name="action" onClick={ this.handleUpload }>
            Upload
          </button>

          <h2>{ this.state.progress }%</h2>
          <h2 style={ this.state.warning ? { color: 'red' } : { color: 'black' }}>
            { this.state.message }
          </h2>

        </div>
      </div>
    );
  }
}
