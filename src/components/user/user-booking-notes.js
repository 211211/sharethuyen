import React from "react";
import Loader from "react-loader";
import { Link, withRouter } from "react-router";
import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import { isString } from "lodash";

@withRouter
export default class UserBookingNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      booking_notes: [],
      loading: false,
      recordsTotal: 0
    };

    this.queryObj = {
      page: 1,
      per_page: 3
    };
    this.onShowMore = this.onShowMore.bind(this);
  }

  componentDidMount() {
    this.loadBookingNotes(1);
  }

  render() {
    const { user } = this.props;
    const { loading, booking_notes, recordsTotal } = this.state;
    const { id } = this.props.params;
    const { onShowMore } = this;
    return (
      <PanelContainer className="bs-user-booking-notes">
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>{user.full_name && <h4>{user.full_name}'s Booking Notes</h4>}</Col>
                </Col>
              </Row>
              <Row>
                {!loading &&
                  booking_notes.length == 0 && (
                    <div style={{ textAlign: "center", color: "#aaa" }}>No matching records found</div>
                  )}
                {booking_notes.length > 0 && (
                  <div className="booking-note-header">
                    <div className="booking-id">Booking #</div>
                    <div className="booking-note">Booking Notes</div>
                  </div>
                )}
                {booking_notes.map((booking_note, index) => {
                  const { user_notes, discount_notes, system_notes, charges } = booking_note;
                  return (
                    <div className="booking-note-row" key={index}>
                      <div className="booking-id">
                        <Link to={`${URL_CONFIG.bookings_path}/${booking_note.id}`}>{booking_note.id}</Link>
                      </div>
                      <div className="booking-note">
                        <NoteItem noteLabel="User Notes" noteContent={user_notes} />
                        <NoteItem noteLabel="Discount Notes" noteContent={discount_notes} />
                        <NoteItem noteLabel="System Notes" noteContent={system_notes} />
                        {charges.map((charge, index) => {
                          return (
                            <NoteItem
                              key={index}
                              noteLabel={CONSTANT.CHARGE_TYPE[charge.charge_type].text + " Charge Notes"}
                              noteContent={charge.note}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {loading && <Loader scale={0.5} position="relative" />}
                {!loading &&
                  recordsTotal > booking_notes.length && (
                    <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                      <a href="#" onClick={onShowMore}>
                        Show More
                      </a>
                    </div>
                  )}
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }

  loadBookingNotes(initPage) {
    const { id } = this.props.params;
    if (initPage) {
      this.queryObj.page = initPage;
    } else {
      this.queryObj.page += 1;
    }
    this.setState({ loading: true });
    const { page, per_page } = this.queryObj;
    const { booking_notes } = this.state;
    client.get(`${URL_CONFIG.users_path}/${id}/booking_notes?page=${page}&per_page=${per_page}`).then(
      res_booking_notes => {
        const { records, recordsTotal } = res_booking_notes;
        this.setState({
          booking_notes: booking_notes.concat(records),
          loading: false,
          recordsTotal
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  onShowMore(e) {
    e.preventDefault();
    this.loadBookingNotes();
  }
}

class NoteItem extends React.Component {
  render() {
    const { noteLabel, noteContent } = this.props;
    if (isString(noteContent) && noteContent.length > 0) {
      return (
        <div>
          <p className="note-type-label">{noteLabel}</p>
          <p className="note-content">{noteContent}</p>
        </div>
      );
    } else return null;
  }
}
