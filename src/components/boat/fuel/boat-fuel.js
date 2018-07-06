import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";
import FuelActions from "../../_core/boat-fuel/fuel-actions";
import { URL_CONFIG } from "../../../common/config";
import ModalConfirm from "../../_core/modal-confirm";
import util from "../../../common/util";
import client from "../../../common/http-client";

export default class BoatFuel extends React.Component {
  constructor(props) {
    super(props);
    this.datatableComponentWrap = withRouter(DatatableComponent, {
      withRef: true
    });
  }

  fuelUpdateSuccess() {
    this.fuelLogTable.getWrappedInstance().reload();
    // Update Boat Form
    this.props.fetchBoat();
  }

  changeMeterSuccess() {
    this.fuelLogTable.getWrappedInstance().reload();
    this.props.fetchBoat();
  }

  render() {
    const { boat } = this.props;
    const { fuel_meter_enabled } = boat;
    const DatatableComponentWrap = this.datatableComponentWrap;
    const boatLoaded = boat && boat.id > 0;
    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="page-header">
                <Col md={6}>
                  <h3>Fuel Log</h3>
                </Col>
                <Col md={6} className="text-right">
                  <FuelActions
                    boat={boat}
                    fuelUpdateSuccess={::this.fuelUpdateSuccess}
                    changeMeterSuccess={::this.changeMeterSuccess}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {boatLoaded && (
                    <DatatableComponentWrap
                      boatId={boat.id}
                      ref={c => (this.fuelLogTable = c)}
                      ajaxUrl={URL_CONFIG.boat_fuel_logs_path}
                    />
                  )}
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

class DatatableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goToView = this.goToView.bind(this);
  }

  componentDidMount() {
    const { props } = this;
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));
    //Work around by expose global fn
    //to make react work with datatable
    window.goToViewFn = this.goToView;
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    this.table = util.initDataTable(datatableEl, props.ajaxUrl, [], {
      ajax: {
        url: props.ajaxUrl,
        data: d => {
          //Filter booking data for specified boat
          d["columns"][1]["search"]["value"] = props.boatId;
        }
      },
      searching: false,
      columnDefs: [
        {
          targets: 0,
          width: "50px"
        },
        {
          targets: 2,
          width: "65px",
          className: "dt-body-center",
          render: function(data, type, row, meta) {
            if (data) {
              var id = data;
              return `<a href="#" onclick="goToViewFn(${id});return false;">#${id}</a>`;
            }
            return "";
          }
        },
        {
          targets: 3,
          width: "65px",
          className: "dt-body-center",
          render: function(data, type, row, meta) {
            if (data) {
              var id = data;
              return `#${id}`;
            }
            return "";
          }
        },
        {
          targets: 4,
          width: "100px"
        },
        {
          targets: 5,
          width: "200px"
        }
      ]
    });
  }

  reload() {
    this.table.ajax.reload();
  }

  goToView(booking_id) {
    this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th data-orderable="false" data-visible="false">
              Boat
            </th>
            <th data-orderable="false">Booking</th>
            <th data-orderable="false">Charge</th>
            <th data-orderable="false">Log Type</th>
            <th data-orderable="false">Changes</th>
            <th data-orderable="false">Notes</th>
            <th data-orderable="false">Created At</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Boat</th>
            <th>Booking</th>
            <th>Charge</th>
            <th>Log Type</th>
            <th>Changes</th>
            <th>Notes</th>
            <th>Created At</th>
          </tr>
        </tfoot>
      </Table>
    );
  }
}
