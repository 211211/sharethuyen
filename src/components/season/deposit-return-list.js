import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import ModalConfirm from "../_core/modal-confirm";
import { URL_CONFIG } from "../../common/config";

import { Table } from "@sketchpixy/rubix";

import util from "../../common/util";
import isNumber from "lodash/isNumber";

@withRouter
class DepositReturnList extends React.Component {
  constructor(props) {
    super(props);

    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.returnDeposit = this.returnDeposit.bind(this);
  }

  componentDidUpdate(prevProps) {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.openConfirmModal = this.openConfirmModal;

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
        url: URL_CONFIG.deposit_return_users_path
      },
      columnDefs: [
        {
          targets: -3,
          render: function(data) {
            return isNumber(data) ? util.currencyFormatter().format(data) : "";
          }
        },
        {
          targets: -2,
          data: null,
          render: function(data, type, row, meta) {
            let userId = data[0];
            return (
              '<button style="margin-right: 5px;" type="button"' +
              'class="remove-sm btn btn-green btn-outlined" ' +
              'onclick="openConfirmModal(' +
              userId +
              ', 1)">ACH</button>' +
              '<button style="margin-right: 5px;" type="button"' +
              'class="remove-sm btn btn-green btn-outlined" ' +
              'onclick="openConfirmModal(' +
              userId +
              ', 4)">CARD</button>' +
              '<button style="margin-right: 5px;" type="button"' +
              'class="remove-sm btn-green btn-outlined btn" ' +
              'onclick="openConfirmModal(' +
              userId +
              ', 2)">CASH</button>' +
              '<button type="button"' +
              'class="remove-sm btn-green btn-outlined btn" ' +
              'onclick="openConfirmModal(' +
              userId +
              ', 3)">CHECK</button>'
            );
          }
        },
        {
          targets: -1,
          data: null,
          render: function(data, type, row, meta) {
            let userId = data[0];
            let paidForMembership = data[5];

            if (!paidForMembership) return null;

            return (
              '<button type="button"' +
              'class="remove-sm btn-red btn-outlined btn" ' +
              'onclick="openConfirmModal(' +
              userId +
              ', 5)">PAID</button>'
            );
          }
        }
      ]
    });
  }

  openConfirmModal(userId, method) {
    this.setState({
      selectedUserId: userId,
      selectedReturnMethod: method
    });

    this.confirmReturnModal.open();
  }

  returnDeposit() {
    console.log(this.state.selectedUserId, this.state.selectedReturnMethod);
    this.confirmReturnModal.setLoading(true);
    $.ajax({
      url: `${URL_CONFIG.users_path}/${this.state.selectedUserId}/return_deposit`,
      method: "POST",
      data: { method: this.state.selectedReturnMethod }
    }).then(
      () => {
        this.confirmReturnModal.setLoading(false);
        this.confirmReturnModal.close();
        this.table.ajax.reload();
      },
      () => {
        this.confirmReturnModal.setLoading(false);
      }
    );
  }

  render() {
    let { rows } = this.props;

    let rowsExist = rows && typeof rows.map === "function";
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>$</th>
            <th data-orderable="false" data-searchable="false">
              Returned By
            </th>
            <th data-orderable="false" data-searchable="false">
              Membership
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>$</th>
            <th>Returned By</th>
            <th>Membership</th>
          </tr>
        </tfoot>
        <ModalConfirm
          message="Are you sure, this cannot be undone?"
          ref={c => (this.confirmReturnModal = c)}
          resolvedFn={::this.returnDeposit}
        />
      </Table>
    );
  }
}

export default DepositReturnList;
