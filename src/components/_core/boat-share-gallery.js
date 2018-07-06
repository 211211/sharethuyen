import React from "react";

import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Image,
  Table,
  Button,
  PanelBody,
  PanelHeader,
  PanelContainer
} from "@sketchpixy/rubix";

import ModalConfirm from "./modal-confirm.js";

class GalleryItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectPrimary = this.handleSelectPrimary.bind(this);
  }

  handleSelectPrimary() {
    this.props.parent.handleSelectPrimary(this.props.image.id);
  }

  handleRemoveImage() {
    this.props.parent.handleRemoveImage(this.props.image.id);
  }

  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelHeader>
            <Grid className="gallery-item">
              <Row>
                <Col xs={12} style={{ padding: 12.5 }}>
                  <a className="gallery-1 gallery-item-link" href={this.props.image.image_url}>
                    <Image responsive src={this.props.image.image_url} width="200" height="150" />
                  </a>
                  <div className="text-center">
                    <h5 className="fg-darkgray50 hidden-xs" style={{ textTransform: "uppercase" }}>
                      {this.props.image.created_at}
                    </h5>
                    <Button
                      outlined
                      onlyOnHover
                      bsStyle="green"
                      className="fav-btn"
                      active={this.props.image.is_primary}
                      onClick={::this.handleSelectPrimary}
                    >
                      <Icon glyph="icon-simple-line-icons-check" />
                    </Button>
                    <Button
                      outlined
                      bsStyle="danger"
                      style={{ marginLeft: 10 }}
                      className="fav-btn"
                      onClick={::this.handleRemoveImage}
                    >
                      <Icon glyph="icon-simple-line-icons-close" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class BoatShareGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.boat_images
    };
    this.handleSelectPrimary = this.handleSelectPrimary.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      images: nextProps.boat_images
    });
  }

  handleSelectPrimary(id) {
    let { boat_images } = this.props;
    boat_images.forEach(function(image) {
      if (image.id == id) {
        image.is_primary = true;
      } else {
        image.is_primary = false;
      }
    });
    this.setState({
      images: boat_images
    });
    this.props.onSelectPrimaryImage(id);
  }

  handleRemoveImage(id) {
    this.deleteBoatImageId = id;
    this.confirmDeleteModal.open();
  }

  removeBoatImage() {
    this.props.onRemoveImage(this.deleteBoatImageId);
    this.confirmDeleteModal.close();
  }

  render() {
    let { images } = this.state;
    let imagesExist = images && typeof images.map === "function";
    return (
      <Row className="gallery-view">
        {imagesExist &&
          images.map((image, index) => {
            if (typeof image._destroy == "undefined" || !image._destroy) {
              return (
                <div key={image.id}>
                  <Col xs={6} sm={4}>
                    <GalleryItem image={image} parent={this} />
                  </Col>
                  {(() => {
                    if ((index + 1) % 3 == 0) {
                      return <Row />;
                    }
                  })()}
                </div>
              );
            }
          })}
        <ModalConfirm
          message="Do you want to remove this Image?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeBoatImage}
        />
      </Row>
    );
  }
}
