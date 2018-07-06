import React from "react";
import Loader from "react-loader";
import { inject, observer } from "mobx-react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import MembershipTypeUtil from "../../../common/membership-type-util";
import client from "../../../common/http-client";
import util from "../../../common/util";

@inject("store")
@observer
export default class UserMembershipChangeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      submitDisabled: false,
      membership_type: props.membership_type
    };
  }

  close() {
    var newState = this.state;
    newState.showModal = false;
    this.setState(newState);
  }

  open() {
    var newState = this.state;
    newState.showModal = true;
    this.setState(newState);
  }

  ok() {
    let { user } = this.props;
    let { user_side } = this.props;
    let { membership_type } = this.state;
    let newState = this.state;
    newState.loaded = false;
    newState.submitDisabled = true;
    this.setState(newState);

    let type = MembershipTypeUtil.sharepassLabelToMembershipType(membership_type);

    let url = `${URL_CONFIG.users_path}/${user.id}/update_membership`;
    if (user_side) {
      url = URL_CONFIG.profile_update_membership_path;
    }

    //TODO: admin side
    client
      .post(url, {
        membership_type: type
      })
      .then(
        response => {
          util.growl("Updated Sharepass membership successfully!");

          if (user_side) {
            this.props.store.updateUser(response);
          } else {
            this.props.loadUserDetail();
          }

          this.setState({
            loaded: true,
            submitDisabled: false,
            showModal: false
          });
        },
        () => {
          var newState = this.state;
          newState.loaded = true;
          newState.submitDisabled = false;
          this.setState(newState);
        }
      );
  }

  onChangeMembershipType(e) {
    var newState = this.state;
    newState.membership_type = e.target.value;
    this.setState(newState);
  }

  render() {
    let disabledUserTypes = this.props.store.settings.disabled_user_types || [];

    let membershipTypes = [
      CONSTANT.MEMBERSHIP_TYPE.full,
      CONSTANT.MEMBERSHIP_TYPE.mid_week,
      CONSTANT.MEMBERSHIP_TYPE.unlimited,
      CONSTANT.MEMBERSHIP_TYPE.shared,
      CONSTANT.MEMBERSHIP_TYPE.daily
    ];

    let availableMembershipType = MembershipTypeUtil.removeDisabledMembershipType(membershipTypes, disabledUserTypes);

    let { membership_type } = this.state;
    let { loaded } = this.state;
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose Sharepass Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col md={5} componentClass={ControlLabel}>
                  Sharepass Type
                </Col>
                <Col md={7}>
                  {availableMembershipType.map(membership_type_item => {
                    let type = MembershipTypeUtil.membershipTypeToSharepassLabel(membership_type_item);
                    return (
                      <Radio
                        defaultValue={type}
                        key={membership_type_item}
                        onChange={::this.onChangeMembershipType}
                        checked={membership_type == type}
                      >
                        {type}
                      </Radio>
                    );
                  })}
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.ok} bsStyle="primary" disabled={this.state.submitDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
