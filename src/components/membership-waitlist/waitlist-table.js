import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer, FormControl } from "@sketchpixy/rubix";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import ModalConfirm from "../_core/modal-confirm";
import client from "../../common/http-client";

@withRouter
export default class WaitlistTable extends React.Component {
  constructor(props) {
    super(props);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.approveFn = this.approveFn.bind(this);
  }

  componentDidMount() {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.openConfirmModalFn = this.openConfirmModal;
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    this.table = datatableEl.addClass("nowrap").DataTable({
      processing: true,
      rowId: "id",
      order: [0, "desc"],
      responsive: true,
      serverSide: true,
      ajax: {
        url: URL_CONFIG.membership_waitlists_path
      },
      drawCallback: () => {
        this.table.responsive.recalc();
      },
      columnDefs: [
        {
          targets: -1,
          data: null,
          render: function(data, type, row, meta) {
            const id = data[0];
            const status = data[5];
            if (id && status == CONSTANT.membershipWaitlistStatus.requested) {
              return `<button type="button"
                class="btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="openConfirmModalFn(${id})">Approve</button>`;
            } else {
              return "";
            }
          }
        }
      ]
    });
  }

  render() {
    return (
      <div>
        <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th data-orderable="false">User's Name</th>
              <th data-orderable="false">User's Email</th>
              <th>Membership Requested</th>
              <th>Membership Status</th>
              <th>Status</th>
              <th>Amount</th>
              <th data-orderable="false" data-searchable="false" />
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>User's Name</th>
              <th>User's Email</th>
              <th>Membership Requested</th>
              <th>Membership Status</th>
              <th>Status</th>
              <th>Amount</th>
              <th />
            </tr>
          </tfoot>
          <ModalConfirm
            message="Do you want to approve this User?"
            ref={c => (this.confirmApprovalModal = c)}
            resolvedFn={::this.approveFn}
          />
        </Table>
      </div>
    );
  }

  approveFn() {
    this.confirmApprovalModal.setLoading(true);

    client.post(`${URL_CONFIG.membership_waitlists_path}/${this.waitlistId}/approve`).then(
      () => {
        this.confirmApprovalModal.setLoading(false);
        this.confirmApprovalModal.close();
        this.table.ajax.reload();
      },
      () => {
        this.confirmApprovalModal.setLoading(false);
      }
    );
  }

  openConfirmModal(waitlistId) {
    this.waitlistId = waitlistId;
    this.confirmApprovalModal.open();
  }
}
