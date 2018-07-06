import React from "react";
import Loader from "react-loader";
import { Icon } from "@sketchpixy/rubix";
import client from "../../../common/http-client";
import { URL_CONFIG } from "../../../common/config";
import Util from "../../../common/util";

export default class CellWaitlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingWaitlist: false,
      addedWaitlist: false
    };
    this.onClickAddWaitlist = this.onClickAddWaitlist.bind(this);
  }
  render() {
    const { onClickAddWaitlist } = this;
    const { addingWaitlist, addedWaitlist } = this.state;
    return (
      <div className="cell-wailist">
        <div className="centered-content">
          <span className="cell-text">Fully Booked</span>
          {!addedWaitlist &&
            !addingWaitlist && (
              <button className="add-to-waitlist-btn" onClick={onClickAddWaitlist}>
                Add To Waitlist
              </button>
            )}
          <Loader loaded={!addingWaitlist} position="relative" scale={0.5} />
          {addedWaitlist && <Icon className="fg-green" style={{ fontSize: 20 }} glyph="icon-fontello-ok" />}
        </div>
      </div>
    );
  }

  onClickAddWaitlist() {
    const { user_side, user_id, boat_class_id, date } = this.props;
    this.setState({
      addingWaitlist: true
    });
    let url = URL_CONFIG.admin_waitlists_path;
    if (user_side) {
      url = URL_CONFIG.user_waitlists_path;
    }
    client
      .post(url, {
        user_id,
        boat_class_id,
        date
      })
      .then(
        () => {
          if (user_side) {
            Util.growl("waitlist_added_successfully");
          } else {
            Util.growl("waitlist_admin_added_successfully");
          }
          this.setState({
            addingWaitlist: false,
            addedWaitlist: true
          });
        },
        () => {
          this.setState({
            addingWaitlist: false
          });
        }
      );
  }
}
