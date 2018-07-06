import React from "react";

import { Col, Image, Button, Icon } from "@sketchpixy/rubix";

import ModalConfirm from "../_core/modal-confirm";

export default class UserCardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteBtn: false
    };
  }

  onMouseEnterUserCard() {
    this.setState({
      showDeleteBtn: true
    });
  }

  onMouseLeaveUserCard() {
    this.setState({
      showDeleteBtn: false
    });
  }

  onClickRemove() {
    this.confirmDeleteModal.open();
  }

  removeFn() {
    this.props.onRemoveUser(this.props.user);
    this.confirmDeleteModal.close();
  }

  render() {
    let { user } = this.props;
    return (
      <Col md={6} onMouseEnter={::this.onMouseEnterUserCard} onMouseLeave={::this.onMouseLeaveUserCard}>
        <div className="user-card-simple">
          <Image width={45} height={45} className="img-circle" src={user.profile_picture_thumb_url} />
          <div className="user-card-detail">
            <div className="user-name">
              {user.full_name}
              {(() => {
                return user.is_paid_membership_charges ? (
                  <Icon
                    className="fg-green"
                    style={{ fontSize: 20 }}
                    title="Membership charge paid"
                    glyph="icon-fontello-ok"
                  />
                ) : (
                  <span> - NOT ACTIVE</span>
                );
              })()}
            </div>
            <div className="user-detail">
              <em>
                {user.email} - {user.phone}
              </em>
            </div>
          </div>
          {this.state.showDeleteBtn &&
            (() => {
              return (
                <Button outlined sm className="remove-btn" bsStyle="danger" onClick={::this.onClickRemove}>
                  Remove
                </Button>
              );
            })()}
        </div>
        <ModalConfirm
          message="Do you want to remove this User?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
      </Col>
    );
  }
}
