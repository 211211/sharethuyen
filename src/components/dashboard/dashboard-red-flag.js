import React from "react";
import reactCSS from "reactcss";
import { Link } from "react-router";
import moment from "moment";
import { Col, Icon, Table } from "@sketchpixy/rubix";

import client from "../../common/http-client";
import { URL_CONFIG, CONSTANT, state } from "../../common/config";

export default class DashboardRedFlag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booking_need_reassigns: [],
      boat_in_attentions: []
    };
  }

  componentDidMount() {
    client.get(URL_CONFIG.admin_dashboard_flag_data_path).then(res => {
      this.setState({
        booking_need_reassigns: res.booking_need_reassigns,
        boat_in_attentions: res.boat_in_attentions
      });
    });
  }

  render() {
    const styles = reactCSS({
      default: {
        redFlagWrapper: {
          border: "1px solid #D71F4B",
          paddingTop: 12.25,
          paddingLeft: 10,
          paddingRight: 10,
          marginBottom: 20
        }
      }
    });

    let { booking_need_reassigns } = this.state;

    let link_tpls =
      booking_need_reassigns.length > 0
        ? booking_need_reassigns.map((booking, index) => {
            let { id } = booking;
            let link = `${URL_CONFIG.bookings_path}/${id}`;
            return (
              <Link key={index} to={link}>
                {" "}
                #{id}{" "}
              </Link>
            );
          })
        : null;

    let { boat_in_attentions } = this.state;

    if (booking_need_reassigns.length > 0 || boat_in_attentions.length > 0) {
      return (
        <Col style={styles.redFlagWrapper} md={6} mdOffset={3}>
          {(() => {
            if (booking_need_reassigns.length > 0) {
              let message = "Booking(s) need re-assign boat: ";
              return (
                <p>
                  <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
                  {message} {link_tpls}
                </p>
              );
            }
          })()}
          {(() => {
            if (boat_in_attentions.length > 0) {
              let message = "Boat(s) need attention: ";
              return (
                <div>
                  <p>
                    <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
                    {message}
                  </p>

                  <div style={{ paddingLeft: 25 }}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Boat Name</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boat_in_attentions.map((boat, index) => {
                          if (boat.attention_type === "booking") {
                            return (
                              <tr key={index}>
                                <td>{boat.name}</td>
                                <td>
                                  <Link to={`${URL_CONFIG.bookings_path}/${boat.booking_id}/complete`}>
                                    Booking {boat.booking_id}{" "}
                                  </Link>
                                </td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={index}>
                                <td>{boat.name}</td>
                                <td>
                                  <Link to={`${URL_CONFIG.boats_path}/${boat.id}/edit`}>
                                    Back from yard on {moment(boat.yard_end_date).format(CONSTANT.DATE_FORMAT_DISPLAY)}{" "}
                                  </Link>
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              );
            }
          })()}
        </Col>
      );
    } else {
      return null;
    }
  }
}
