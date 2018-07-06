import React from "react";
import Loader from "react-loader";

import { Form, Row, Col, FormGroup, FormControl, ControlLabel } from "@sketchpixy/rubix";

import SimpleImagePreview from "../../_core/simple-image-preview";

export default class ProfileEndorsementLicense extends React.Component {
  render() {
    let { user } = this.props;
    let { user_profile } = user;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Licenses</h4>
        </Col>
        <Col md={6} sm={12} style={{ marginTop: 10 }}>
          <Col sm={6} className="license-img">
            <SimpleImagePreview
              image_url={user_profile.wa_state_marine_photo_url}
              image_thumb_url={user_profile.wa_state_marine_photo_thumb_url}
            />
          </Col>
          <Col sm={6}>
            <Form>
              <FormGroup>
                <ControlLabel>WA State Boaters card</ControlLabel>
                <FormControl disabled value={user_profile.wa_state_marine_field} />
              </FormGroup>
            </Form>
          </Col>
        </Col>
        <Col md={6} sm={12} style={{ marginTop: 10 }}>
          <Col sm={6} className="license-img">
            <SimpleImagePreview
              image_url={user_profile.driver_license_photo_url}
              image_thumb_url={user_profile.driver_license_photo_thumb_url}
            />
          </Col>
          <Col sm={6}>
            <Form>
              <FormGroup>
                <ControlLabel>Driver License #</ControlLabel>
                <FormControl disabled value={user_profile.driver_license_field} />
              </FormGroup>
            </Form>
          </Col>
        </Col>
      </Row>
    );
  }
}
