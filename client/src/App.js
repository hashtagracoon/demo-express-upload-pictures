import React, { Component } from 'react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import Materialize from 'materialize-css';

export default class App extends Component {

  state = {
    pictures: [],
    progress: 0
  };

  onDrop = (pictures) => {
    console.log(pictures);
    if(pictures.length > 3) {
      Materialize.toast({html: 'Warning: You can only upload up to 3 pictures!'});
      this.setState({
        pictures: [],
        progress: 0
      });
    }
    else {
      this.setState({
        pictures: pictures,
        progress: 0
      });
    }
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
              Materialize.toast({html: 'Upload Completed!'});
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

        </div>
      </div>
    );
  }
}
