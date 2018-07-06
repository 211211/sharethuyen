import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Link } from "react-router";
import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";
import ModalConfirm from "../components/_core/modal-confirm";
import { URL_CONFIG } from "../common/config";
import Util from "../common/util";

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    $.getJSON(`${URL_CONFIG.users_path_json}`).then(res => {
      this.setState({
        users: res.users
      });
    });
  }

  openAddUserForm() {
    this.props.router.push(`${URL_CONFIG.users_path}/new`);
  }

  render() {
    let { users } = this.state;

    let usersExist = users && typeof users.map === "function";
    let exportLink = `/admin/users/export.csv`;

    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>
                    <h4>Users</h4>
                  </Col>
                  <Col md={6} className="text-right">
                    <Button lg outlined bsStyle="primary" onClick={::this.openAddUserForm}>
                      Add
                    </Button>{" "}
                    <Button lg outlined bsStyle="primary" href={exportLink}>
                      Export
                    </Button>{" "}
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DatatableComponent rows={users} ajaxUrl={URL_CONFIG.users_path_json} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

@withRouter
class DatatableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goToEdit = this.goToEdit.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.goToEndorsement = this.goToEndorsement.bind(this);
    this.goToBookingFn = this.goToBookingFn.bind(this);
    this.goToNotesFn = this.goToNotesFn.bind(this);
  }

  componentDidUpdate(prevProps) {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));
    datatableEl.on("search.dt", () => Util.setQueryUrl($(".dataTables_filter input").val()));
    //Work around by expose global fn
    //to make react work with datatable
    window.goToEditFn = this.goToEdit;
    window.goToEndorsementFn = this.goToEndorsement;
    window.openConfirmModalFn = this.openConfirmModal;
    window.goToBookingFn = this.goToBookingFn;
    window.goToNotesFn = this.goToNotesFn;
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
        url: this.props.ajaxUrl
      },
      columnDefs: [
        {
          targets: -1,
          data: null,
          render: function(data, type, row, meta) {
            var userId = data[0];
            return `<button
                style="margin-right:8px;" type="button"
                class="remove-sm btn-red btn btn-default"
                onclick="openConfirmModalFn(${userId})">Remove
              </button>
              <button
                style="margin-right:8px;" type="button"
                class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="goToEditFn(${userId})">Edit
              </button>
              <button type="button"
                style="margin-right:8px;" class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="goToEndorsementFn(${userId})">Endorsements
              </button>
              <button type="button"
              style="margin-right:8px;" class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="goToBookingFn(${userId})">Bookings
              </button>
              <button type="button"
                class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default"
                onclick="goToNotesFn(${userId})">Notes
              </button>`;
          }
        }
      ],
      search: { search: Util.retrieveSearchQuery() }
    });
  }

  removeUser() {
    this.confirmDeleteModal.setLoading(true);
    $.ajax({
      url: `${URL_CONFIG.users_path}/${this.deleteUserId}`,
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

  openConfirmModal(userId) {
    this.deleteUserId = userId;
    this.confirmDeleteModal.open();
  }

  goToEdit(userId) {
    this.props.router.push(`${URL_CONFIG.users_path}/${userId}/edit`);
  }

  goToEndorsement(userId) {
    this.props.router.push(`${URL_CONFIG.users_path}/${userId}/endorsement`);
  }

  goToBookingFn(userId) {
    this.props.router.push(`${URL_CONFIG.users_path}/${userId}/bookings`);
  }

  goToNotesFn(userId) {
    this.props.router.push(`${URL_CONFIG.users_path}/${userId}/notes`);
  }

  render() {
    let { rows } = this.props;

    let rowsExist = rows && typeof rows.map === "function";
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th data-orderable="false">Phone</th>
            <th>Type of membership</th>
            <th>Group</th>
            <th>Status of membership</th>
            <th>Expire On</th>
            <th>Security deposit</th>
            <th data-orderable="false" data-searchable="false" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Type of membership</th>
            <th>Group</th>
            <th>Status of membership</th>
            <th>Expire On</th>
            <th>Security deposit</th>
            <th />
          </tr>
        </tfoot>
        <ModalConfirm
          message="Do you want to remove this User?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeUser}
        />
      </Table>
    );
  }
}
