import React from "react";
import { Link } from "react-router";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

export default class BoatShareForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDisabled: false
    };
  }

  setSubmitDisable(value) {
    this.setState({
      submitDisabled: value
    });
  }

  render() {
    let { errors } = this.props;
    let errorKeys = Object.keys(errors);

    errors = errorKeys.length ? (
      <Alert danger dismissible>
        {errorKeys.map((field, i) => {
          return (
            <div key={i}>
              <div>
                <strong>{field}:</strong>
              </div>
              <ul>
                {errors[field].map((error, j) => {
                  return <li key={j}>{error}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </Alert>
    ) : null;

    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="page-header">
                <Col md={6}>
                  <h3>{this.props.title}</h3>
                </Col>
                {(() => {
                  if (this.props.button_right_text) {
                    return (
                      <Col md={6} className="text-right">
                        <Link to={this.props.button_right_url} className="btn-outlined btn btn-lg btn-primary">
                          {this.props.button_right_text}
                        </Link>
                      </Col>
                    );
                  }
                })()}
              </Row>
              <Row>
                <Col md={12}>{errors}</Col>
                <Col md={12}>{this.props.children}</Col>
              </Row>
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12}>
                  <br />
                  <div>
                    <Button outlined bsStyle="default" onClick={::this.props.onCancelFn}>
                      Cancel
                    </Button>{" "}
                    <Button
                      outlined
                      bsStyle="primary"
                      onClick={::this.props.onSubmitFn}
                      disabled={this.state.submitDisabled}
                    >
                      {this.props.submitBtn}
                    </Button>
                  </div>
                  <br />
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }
}
