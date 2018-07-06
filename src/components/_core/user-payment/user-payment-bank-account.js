import React from "react";
import { Col, Row, FormGroup, Button, Image, FormControl, ControlLabel } from "@sketchpixy/rubix";

import BoatShareAddress from "../boat-share-address";
import { IMAGES } from "../../../common/config";

export default class UserPaymentBankAccount extends React.Component {
  render() {
    return (
      <Row>
        <Col sm={2} md={1} className="hidden-xs">
          <Image responsive src={IMAGES.bank} />
        </Col>
        <Col sm={9}>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Bank Name
            </Col>
            <Col sm={3}>
              <FormControl.Static>{this.props.card.bank_name}</FormControl.Static>
            </Col>
            <Col sm={2} componentClass={ControlLabel}>
              Currency
            </Col>
            <Col sm={3}>
              <FormControl.Static>{this.props.card.currency}</FormControl.Static>
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
                        <Button outlined bsStyle="info" style={{ marginBottom: 5 }} onClick={this.props.linkAddress}>
                          Update
                        </Button>
                        <BoatShareAddress address={this.props.address} />
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <em>Not linked</em>
                        <Button outlined bsStyle="info" style={{ marginLeft: 7 }} onClick={this.props.linkAddress}>
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
