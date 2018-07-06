import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Table } from "@sketchpixy/rubix";
import moment from "moment";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import util from "../../common/util";

@withRouter
export default class WaitlistTable extends React.Component {
  componentDidMount() {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.turnToBooking = this.turnToBooking.bind(this);
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    util.initDataTable(datatableEl, URL_CONFIG.admin_waitlists_path, [
      {
        targets: -1,
        data: null,
        render: function(data, type, row, meta) {
          const id = data[0];
          const bookData = data[5];
          const { availability, user_id, boat_class_id, date } = bookData;
          const dateFormatted = moment(date).format(CONSTANT.DATE_FORMAT);
          if (availability !== "no") {
            return `<button type="button"
            class="btn-green btn-onlyOnHover btn-outlined btn btn-default"
            onclick="turnToBooking(${user_id}, ${boat_class_id}, '${dateFormatted}')">Turn to Booking</button>`;
          } else {
            return "";
          }
        }
      }
    ]);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th data-orderable="false">User's Name</th>
            <th data-orderable="false">User's Email</th>
            <th data-orderable="false">Boat Class</th>
            <th>Date</th>
            <th data-orderable="false" data-searchable="false" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>User's Name</th>
            <th>User's Email</th>
            <th>Boat Class</th>
            <th>Date</th>
            <th />
          </tr>
        </tfoot>
      </Table>
    );
  }

  turnToBooking(user_id, boat_class_id, date) {
    this.props.router.push(
      `${
        URL_CONFIG.bookings_path
      }/new?turnToBooking=true&user_id=${user_id}&boat_class_id=${boat_class_id}&date=${date}`
    );
  }
}
