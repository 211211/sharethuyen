import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer, FormControl } from "@sketchpixy/rubix";
import ModalConfirm from "../modal-confirm";
import { URL_CONFIG } from "../../../common/config";
import BookingStatusFilter from "./booking-status-filter";
import Util from "../../../common/util";

@withRouter
export default class BookingTable extends React.Component {
  constructor(props) {
    super(props);
    this.goToView = this.goToView.bind(this);
    this.goToUserProfile = this.goToUserProfile.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.state = {
      search: Util.retrieveSearchQuery(),
      filteredStatuses: ["tba", "confirmed", "in_use", "processing", "checked_in", "completed"]
    };
  }

  componentDidMount(prevProps) {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.goToViewFn = this.goToView;
    window.goToUserProfileFn = this.goToUserProfile;
    window.openConfirmModalFn = this.openConfirmModal;
    window.goToEditFn = this.goToEdit.bind(this);
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    this.table = datatableEl.addClass("nowrap").DataTable({
      processing: true,
      rowId: "id",
      order: [0, "desc"],
      searching: false,
      responsive: true,
      serverSide: true,
      ajax: {
        url: this.props.ajaxUrl,
        data: d => {
          const search = $(".bs-search").val();
          d["search"]["value"] = search;
          const { filteredStatuses } = this.state;
          d["columns"][3]["search"]["value"] = filteredStatuses;
          const { boatId, userId } = this.props;
          if (boatId) {
            d["columns"][4]["search"]["value"] = boatId;
          }
          if (userId) {
            d["columns"][5]["search"]["value"] = userId;
          }
        }
      },
      drawCallback: () => {
        this.table.responsive.recalc();
      },
      columnDefs: [
        {
          targets: 1,
          render: function(data, type, row, meta) {
            if (data == "happy_hour") {
              return `<div class="text-center" title="Happy Hour"><span class="rubix-icon icon-fontello-smile fg-green"></span></div>`;
            } else if (data == "lesson_use") {
              return `<div class="text-center" title="Lesson Use"><span class="rubix-icon icon-fontello-book-1 fg-green"></span></div>`;
            } else if (data == "admin_use") {
              return `<div class="text-center" title="Admin Use"><span class="rubix-icon icon-fontello-user fg-green"></span></div>`;
            } else {
              return "";
            }
          }
        },
        {
          targets: 2,
          render: function(data, type, row, meta) {
            return '<span class="label label-success">' + data + "</span>";
          }
        },
        {
          targets: 3,
          render: function(data, type, row, meta) {
            if (data) {
              return data;
            } else {
              return "<em>Not assigned</em>";
            }
          }
        },
        {
          targets: 4,
          data: null,
          render: function(data, type, row, meta) {
            var userId = data[data.length - 1];
            if (userId) {
              return `<a href="" onclick="goToUserProfileFn('${userId}');return false;">${data[4]}</a>`;
            } else {
              return "";
            }
          }
        },
        {
          targets: -1,
          data: null,
          render: function(data, type, row, meta) {
            var id = data[0];
            const status = data[2];
            const editable = ["TBA", "CONFIRMED", "IN USE"].indexOf(status) != -1;
            const editBtnTpl = editable
              ? `<button type="button"
            class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
            onclick="goToEditFn(${id})">Edit</button>`
              : "";
            if (id) {
              return `<button type="button"
                class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="goToViewFn(${id})">View</button>
                ${editBtnTpl}`;
            } else {
              return "";
            }
          }
        }
      ]
    });
  }

  removeFn() {
    this.confirmDeleteModal.setLoading(true);
    $.ajax({
      url: `${URL_CONFIG.bookings_path}/${this.bookingId}`,
      method: "DELETE"
    }).then(
      () => {
        this.confirmDeleteModal.setLoading(false);
        this.confirmDeleteModal.close();
        this.table.ajax.reload();
      },
      () => {
        this.confirmDeleteModal.setLoading(false);
      }
    );
  }

  openConfirmModal(bookingId) {
    this.bookingId = bookingId;
    this.confirmDeleteModal.open();
  }

  goToView(booking_id) {
    this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
  }

  goToEdit(booking_id) {
    this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}/edit`);
  }

  goToUserProfile(user_id) {
    this.props.router.push(`${URL_CONFIG.users_path}/${user_id}/edit`);
  }

  render() {
    const { search, filteredStatuses } = this.state;
    const { _onChangeSearch, _addFilterStatus, _removeFilterStatus } = this;
    return (
      <div>
        <div className="bs-datatable-filter">
          <div className="bs-right">
            <BookingStatusFilter
              filteredStatuses={filteredStatuses}
              addFilterStatus={_addFilterStatus.bind(this)}
              removeFilterStatus={_removeFilterStatus.bind(this)}
            />
            <label>
              Search:
              <FormControl
                type="search"
                className="form-control bs-search"
                value={search}
                onChange={_onChangeSearch.bind(this)}
              />
            </label>
          </div>
        </div>
        <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th data-orderable="false">User's Name</th>
              <th data-orderable="false">User's Email</th>
              <th data-orderable="false">Boat</th>
              <th data-orderable="false">Boat Class</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th data-orderable="false" data-searchable="false" />
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>User's Name</th>
              <th>User's Email</th>
              <th>Boat</th>
              <th>Boat Class</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th />
            </tr>
          </tfoot>
          <ModalConfirm
            message="Do you want to remove this Booking?"
            ref={c => (this.confirmDeleteModal = c)}
            resolvedFn={::this.removeFn}
          />
        </Table>
      </div>
    );
  }

  _addFilterStatus(status) {
    let { filteredStatuses } = this.state;
    filteredStatuses.push(status);
    this.setState({ filteredStatuses });
    this.table.ajax.reload();
  }

  _removeFilterStatus(status) {
    let { filteredStatuses } = this.state;
    const index = filteredStatuses.indexOf(status);
    filteredStatuses.splice(index, 1);
    this.setState({ filteredStatuses });
    this.table.ajax.reload();
  }

  _onChangeSearch(e) {
    const search = e.target.value;
    this.setState({ search });
    Util.setQueryUrl(search);
    this.table.ajax.reload();
  }
}
