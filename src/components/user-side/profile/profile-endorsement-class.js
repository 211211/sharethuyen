import React from "react";
import Loader from "react-loader";
import { inject, observer } from "mobx-react";

import { Row, Col, Button } from "@sketchpixy/rubix";

@inject("store")
@observer
export default class ProfileEndorsementClass extends React.Component {
  render() {
    const { settings } = this.props.store;
    let { user } = this.props;
    let { boat_classes } = user;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Boat Classes available to book</h4>
        </Col>
        <Col md={12}>
          {(() => {
            if (boat_classes.length == 0) {
              return <em>No boat classes available!</em>;
            }
          })()}
          {boat_classes.map((boat_class, index) => {
            return (
              <Col md={6} key={index}>
                <p className="boat-class-select-item">
                  <span className="color-swatch-select" style={{ backgroundColor: boat_class.color_hex }} />
                  {boat_class.name}
                </p>
              </Col>
            );
          })}
        </Col>

        <Col md={12} className="text-right">
          <a className="user-side-btn btn btn-default" target="_blank" href={settings.website_url + "/boat-classes"}>
            More about boat classes & Qualification
          </a>
        </Col>
      </Row>
    );
  }
}
