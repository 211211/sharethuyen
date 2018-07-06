import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, FormControl, Button, ControlLabel } from "@sketchpixy/rubix";

import client from "../../../common/http-client";
import { URL_CONFIG } from "../../../common/config";

@inject("store")
@observer
export default class BookingNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_notes: props.booking.user_notes,
      disabledUpdateButton: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      user_notes: nextProps.booking.user_notes
    });
  }

  handleChangeUserNote(e) {
    var newState = this.state;
    newState.user_notes = e.target.value;
    this.setState(newState);
    this.props.handleChangeUserNote(e.target.value);
  }

  updateUserNotes() {
    this.setState({
      disableUpdateButton: true
    });

    let bookingId = this.props.booking.id;
    let data = {
      booking: {
        user_notes: this.state.user_notes
      }
    };

    client.put(`${URL_CONFIG.bookings_path}/${bookingId}/update_notes`, data).then(
      response => {
        this.setState({
          disabledUpdateButton: false
        });
      },
      () => {
        this.setState({
          disabledUpdateButton: false
        });
      }
    );
  }

  render() {
    const { user_side } = this.props.store;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">
            Notes {!user_side && <span className="label label-warning">Public</span>}
          </h4>
        </Col>
        <Col sm={3} />
        <Col sm={9}>
          <FormControl
            placeholder="Notes"
            componentClass="textarea"
            rows="3"
            value={this.state.user_notes}
            className="user-notes"
            onChange={::this.handleChangeUserNote}
          />
          {(() => {
            if (this.props.booking.id) {
              return (
                <Button
                  outlined
                  bsStyle="info"
                  onClick={::this.updateUserNotes}
                  disabled={this.state.disabledUpdateButton}
                >
                  Update Note
                </Button>
              );
            }
          })()}
        </Col>
      </Row>
    );
  }
}
