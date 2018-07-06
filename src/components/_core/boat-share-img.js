import React from "react";

import { Row, Col, Grid, Panel, Image, PanelHeader, PanelContainer } from "@sketchpixy/rubix";

export default class BoatShareImg extends React.Component {
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
                  <a className="gallery-1 gallery-item-link" href={this.props.image_url}>
                    <Image responsive src={this.props.image_url} />
                  </a>
                  <div className="text-center">
                    <h5 className="fg-darkgray50 hidden-xs">{this.props.title}</h5>
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
