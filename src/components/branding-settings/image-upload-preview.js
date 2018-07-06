import React from "react";

export default class ImageUploadPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: "",
      imagePreviewUrl: props.image
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image && nextProps.image !== this.state.imagePreviewUrl) {
      this.setState({
        imagePreviewUrl: nextProps.image
      });
    }
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);

    this.props.onFileChange(this.props.setting_key, file);
  }

  render() {
    let { imagePreviewUrl } = this.state;

    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = <img src={imagePreviewUrl} />;
    }

    return (
      <div>
        <input type="file" accept="image/x-png,image/jpeg" onChange={::this._handleImageChange} />
        <div className="image-preview">{imagePreview}</div>
      </div>
    );
  }
}
