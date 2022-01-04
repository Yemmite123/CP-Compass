import React, { Component } from 'react'
import './style.scss';

class DragDropFileInput extends Component {
  state = {
    dragEntered: false,
    file: null,
  }
  dropRef = React.createRef()

  componentDidMount() {
    const { current: dropLocation } = this.dropRef;
    const { handleFile } = this.props;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(dragEvent => {
        dropLocation.addEventListener(dragEvent, (e) => {
            e.preventDefault();
            e.stopPropagation();
        })
    });

    ['dragenter', 'dragover'].forEach(dragEvent => {
        dropLocation.addEventListener(dragEvent, (e) => {
            this.setState({dragEntered: true});
        })
    });
      
    ['dragleave', 'drop'].forEach(dragEvent => {
        dropLocation.addEventListener(dragEvent, (e) => {
            this.setState({dragEntered: false});
        })
    });

    dropLocation.addEventListener('drop', e => {
        const { files } = e.dataTransfer;
        this.setState({ file: [...files] });
        handleFile(files);
    });
  }

  onFileChange = e => { 
    this.setState({ file: [...e.target.files] });
    this.props.handleFile(e.target.files);
  };
  
  render() {
    const { dragEntered, file } = this.state;
    const { error } = this.props;

    return (
        <div 
            className="form-group file-input-box" ref={this.dropRef}
            style={{backgroundColor: dragEntered ? '#0080ff7c' : '#fff', borderColor: error ? '#BD1111' : ''}}
        >
            <label className="file-input-box__button text-small" htmlFor="file">
            <span className="text-blue">+ Add files</span> or drop files here
            </label>
            <div className="d-flex">
                {file && file.length > 0 && file.map(doc => (
                    <span className="file-input-box__info">{doc.name}</span>
                ))}
            </div>
            <input type="file"
                className="form-control"
                placeholder="" 
                id="file"
                onChange={this.onFileChange}
                multiple
            />
        </div>
    )
  }
}
export default DragDropFileInput;