import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import { Link } from "react-router";

import ModalConfirm from "../components/_core/modal-confirm";

import { URL_CONFIG } from "../common/config";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import util from "../common/util";

export default class Lessons extends React.Component {
  constructor(props) {
    super(props);
  }

  openAddForm() {
    this.props.router.push(`${URL_CONFIG.lessons_path}/new`);
  }

  openAddBookingForm() {
    this.props.router.push(`${URL_CONFIG.lessons_path}/book`);
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
                    <h4>Lessons</h4>
                  </Col>
                  <Col md={6} className="text-right">
                    <Button lg outlined bsStyle="primary" onClick={::this.openAddBookingForm}>
                      Add Lesson Booking
                    </Button>{" "}
                    <Button lg outlined bsStyle="primary" onClick={::this.openAddForm}>
                      Add Lesson
                    </Button>{" "}
                  </Col>
                </Col>
              </Row>
              <Row className="lesson-tbl">
                <Col md={12}>
                  <DatatableComponent ajaxUrl={URL_CONFIG.lessons_path} />
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
            var lessonId = data[0];
            return (
              '<button style="margin-right:12.5px;" type="button"' +
              'class="remove-sm btn-red btn btn-default" ' +
              'onclick="openConfirmModalFn(' +
              lessonId +
              ')">Remove</button>' +
              '<button type="button"' +
              'class="remove-sm btn-green btn-onlyOnHover btn-outlined btn btn-default" ' +
              'onclick="goToEditFn(' +
              lessonId +
              ')">Edit</button>'
            );
          }
        },
        {
          targets: 2,
          render: function(data, type, row, meta) {
            return util.currencyFormatter().format(data);
          }
        }
      ]
    });
  }

  removeLesson() {
    this.confirmDeleteModal.setLoading(true);
    $.ajax({
      url: `${URL_CONFIG.lessons_path}/${this.lessonId}`,
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

  openConfirmModal(lessonId) {
    this.lessonId = lessonId;
    this.confirmDeleteModal.open();
  }

  goToEdit(lessonId) {
    this.props.router.push(`${URL_CONFIG.lessons_path}/${lessonId}/edit`);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th data-orderable="false" data-searchable="false">
              Price
            </th>
            <th data-orderable="false" data-searchable="false" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th />
          </tr>
        </tfoot>
        <ModalConfirm
          message="Do you want to remove this Lesson?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeLesson}
        />
      </Table>
    );
  }
}
