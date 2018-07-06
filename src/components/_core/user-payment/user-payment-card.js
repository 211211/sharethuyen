import React from "react";

import { Col, Row, FormGroup, Button, Image, FormControl, ControlLabel } from "@sketchpixy/rubix";

import BoatShareAddress from "../boat-share-address";
import { IMAGES } from "../../../common/config";

export default class UserPaymentCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row>
        <Col sm={2} md={1} className="hidden-xs">
          <Image responsive src={IMAGES.credit_card} />
        </Col>
        <Col sm={9}>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Type
            </Col>
            <Col sm={3}>
              <FormControl.Static>
                {this.props.card.brand} {this.props.card.funding} {this.props.card.object}
              </FormControl.Static>
            </Col>
            <Col sm={2} componentClass={ControlLabel}>
              Expires
            </Col>
            <Col sm={3}>
              <FormControl.Static>
                {this.props.card.exp_month} / {this.props.card.exp_year}
              </FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Name
            </Col>
            <Col sm={3}>
              <FormControl.Static>
                {(() => {
                  if (this.props.card.name && this.props.card.name.length > 0) {
                    return this.props.card.name;
                  } else {
                    return <em>No name provided</em>;
                  }
                })()}
              </FormControl.Static>
            </Col>
            <Col sm={2} componentClass={ControlLabel}>
              Origin
            </Col>
            <Col sm={3}>
              <FormControl.Static>{this.props.card.country}</FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Number
            </Col>
            <Col sm={3}>
              <FormControl.Static>···· {this.props.card.last4}</FormControl.Static>
            </Col>
            <Col sm={2} componentClass={ControlLabel}>
              Billing Address #
            </Col>
            <Col sm={3}>
              <div className="form-control-static">
                {(() => {
                  if (this.props.address && this.props.address.id) {
                    return (
                      <div>
                        <Button outlined bsStyle="info" style={{ marginBottom: 5 }} onClick={::this.props.linkAddress}>
                          Update
                        </Button>
                        <BoatShareAddress address={this.props.address} />
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <em>Not linked</em>
                        <Button outlined bsStyle="info" style={{ marginLeft: 7 }} onClick={::this.props.linkAddress}>
                          Link
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
