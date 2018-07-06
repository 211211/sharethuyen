import React from "react";
import Select from "react-select";
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

import client from "../../common/http-client";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import UserEndorsementForm from "../_core/user/user-endorsement-form";
import UserFormLicense from "./user-form-license";
import UserUtil from "./user-util";

export default class UserFormEndorsement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserUtil.mapUserEndorsementState({}),
      boat_classes: []
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.users_path}/${id}/endorsement`).then(res => {
      let newState = this.state;
      newState.user = UserUtil.mapUserEndorsementState(res);
      this.setState(newState);
    });

    client.get(`${URL_CONFIG.admin_boat_classes_search_path}`).then(res => {
      var newState = this.state;
      newState.boat_classes = res;
      this.setState(newState);
    });
  }

  setSubmitDisable(value) {
    this.setState({
      submitDisabled: value
    });
  }

  onSubmitFn() {
    let { id } = this.props.params;
    let { user } = this.state;
    user.endorsement = this.userEndorsementForm.buildEndorsement();
    let userFormData = UserUtil.buildSubmitUserEndorsement(user);

    this.setSubmitDisable(true);

    client.postFormData(`${URL_CONFIG.users_path}/${id}/update_endorsement`, userFormData).then(
      response => {
        this.props.router.push(URL_CONFIG.users_path);
      },
      response => {
        this.setSubmitDisable(false);
      },
      response => {
        this.setSubmitDisable(false);
      }
    );
  }

  updateEndorsementToState(state) {
    let { user } = state;

    //Need to update lastest endorsement to the state to keep track
    //Since the data from endorsement might changed already
    user.endorsement = this.userEndorsementForm.buildEndorsement();
  }

  handleFieldChange(field, value) {
    var newState = this.state;
    this.updateEndorsementToState(newState);
    newState = UserUtil.handleFieldChange(newState, field, value);
    this.setState(newState);
  }

  onCancelFn() {
    this.props.router.push(`${URL_CONFIG.users_path}`);
  }

  onSelectBoatClass(val) {
    this.handleFieldChange("boat_class_ids", this.getBoatClassIds(val));
  }

  getBoatClassIds(boat_classes) {
    var boat_class_ids = [];
    if (boat_classes && typeof boat_classes.map == "function") {
      boat_class_ids = boat_classes.map(boat_class => {
        return boat_class.id;
      });
    }
    return boat_class_ids;
  }

  optionRendererFn(option) {
    return (
      <p className="boat-class-select-item">
        <span className="color-swatch-select" style={{ backgroundColor: option.color_hex }} />
        {option.name}
      </p>
    );
  }

  render() {
    let sel_boat_classes = [];
    let { user } = this.state;
    if (user.boat_class_ids.length > 0 && this.state.boat_classes.length > 0) {
      user.boat_class_ids.forEach(id => {
        sel_boat_classes.push(
          this.state.boat_classes.find(boat_class => {
            return boat_class.id == id;
          })
        );
      });
    }

    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="page-header">
                <Col xs={6}>
                  <h3>Edit Endorsement: {this.state.user.full_name}</h3>
                </Col>
                <Col xs={6} className="text-right">
                  <Link
                    to={`${URL_CONFIG.users_path}/${this.state.user.id}/edit`}
                    className="btn-outlined btn btn-lg btn-primary"
                  >
                    Edit this user
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup controlId="staticControl">
                    <Col sm={3} componentClass={ControlLabel}>
                      Boat Class Available
                    </Col>
                    <Col sm={9}>
                      <Select
                        name="form-field-name"
                        value={sel_boat_classes}
                        multi={true}
                        labelKey="name"
                        valueKey="id"
                        options={this.state.boat_classes}
                        optionRenderer={::this.optionRendererFn}
                        onChange={::this.onSelectBoatClass}
                      />
                    </Col>
                  </FormGroup>
                  <UserFormLicense user_profile={this.state.user.user_profile} parent={this} />

                  <UserEndorsementForm ref={c => (this.userEndorsementForm = c)} user={user} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12}>
                  <br />
                  <div>
                    <Button outlined bsStyle="default" onClick={::this.onCancelFn}>
                      Cancel
                    </Button>{" "}
                    <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={this.state.submitDisabled}>
                      Save
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
