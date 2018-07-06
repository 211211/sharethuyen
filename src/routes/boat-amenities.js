import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import { Link } from "react-router";

import ModalConfirm from "../components/_core/modal-confirm";

import { URL_CONFIG } from "../common/config";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

export default class BoatAmenities extends React.Component {
  constructor(props) {
    super(props);
  }

  openAddForm() {
    this.props.router.push(`${URL_CONFIG.boat_amenities_path}/new`);
  }

  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>
                    <h4>Boat Amenities</h4>
                  </Col>
                  <Col md={6} className="text-right">
                    <Button lg outlined bsStyle="primary" onClick={::this.openAddForm}>
                      Add
                    </Button>{" "}
                  </Col>
                </Col>
              </Row>
              <Row className="boat-amenity-tbl">
                <Col md={12}>
                  <DatatableComponent ajaxUrl={URL_CONFIG.boat_amenities_path} />
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
  }

  componentDidMount(prevProps) {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.goToEditFn = this.goToEdit;
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
        url: this.props.ajaxUrl
      },
      columnDefs: [
        {
          targets: -1,
          data: null,
          render: function(data, type, row, meta) {
            var amentaryId = data[0];
            return (
              '<button style="margin-right:12.5px;" type="button"' +
              'class="remove-sm btn-red btn btn-default" ' +
              'onclick="openConfirmModalFn(' +
              amentaryId +
              ')">Remove</button>' +
              '<button type="button"' +
              'class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default" ' +
              'onclick="goToEditFn(' +
              amentaryId +
              ')">Edit</button>'
            );
          }
        },
        {
          targets: 2,
          render: function(data, type, row, meta) {
            return `<img src=${data} class='rubix-icon fg-green ${data} boat-amenity-icon'>`;
          }
        }
      ]
    });
  }

  removeBoatAmentary() {
    this.confirmDeleteModal.setLoading(true);
    $.ajax({
      url: `${URL_CONFIG.boat_amenities_path}/${this.amentaryId}`,
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

  openConfirmModal(amentaryId) {
    this.amentaryId = amentaryId;
    this.confirmDeleteModal.open();
  }

  goToEdit(amentaryId) {
    this.props.router.push(`${URL_CONFIG.boat_amenities_path}/${amentaryId}/edit`);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th data-orderable="false" data-searchable="false">
              Icon
            </th>
            <th data-orderable="false" data-searchable="false" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Icon</th>
            <th />
          </tr>
        </tfoot>
        <ModalConfirm
          message="Do you want to remove this Boat Amentary?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeBoatAmentary}
        />
      </Table>
    );
  }
}
