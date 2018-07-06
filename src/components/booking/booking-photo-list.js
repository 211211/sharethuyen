import React from "react";
import ReactDOM from "react-dom";

import {
  Row,
  Col,
  Grid,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  Image,
  PanelFooter,
  Icon,
  Table,
  ControlLabel
} from "@sketchpixy/rubix";

export default class BookingPhotoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      random: Math.random()
        .toString(36)
        .substr(2, 5)
    };
  }

  componentDidMount() {
    this.initLightBox();
  }

  initLightBox() {
    let id = `#photoContainer-${this.state.random}`;
    $(id).on("click", "a", function(event) {
      event = event || window.event;
      var link = $(this).get(0),
        options = { index: link, event: event, toggleControlsOnReturn: false, toggleControlsOnSlideClick: false },
        links = $(id + " a.gallery-item-link");
      blueimp.Gallery(links, options);
    });
  }

  render() {
    let { images } = this.props;
    let id = `photoContainer-${this.state.random}`;
    return (
      <Row>
        <Col md={12} id={id}>
          {images.map((image, index) => {
            return (
              <Col xs={2} key={index}>
                <BoatShareImg image_url={image.url} thumbnail_url={image.thumbnail_url} />
              </Col>
            );
          })}
        </Col>
      </Row>
    );
  }
}

class BoatShareImg extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelHeader>
            <Grid className="gallery-item">
              <Row>
                <Col xs={12} style={{ padding: 12.5 }}>
                  <a className="gallery-item-link" href={this.props.image_url}>
                    <Image responsive src={this.props.thumbnail_url} />
                  </a>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
        </Panel>
      </PanelContainer>
    );
  }
}
