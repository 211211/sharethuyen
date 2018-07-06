import React from "react";
import DatePicker from "react-datepicker";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

import { CONSTANT } from "../../common/config";

export default class ExportTransactions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start_date: "",
      end_date: ""
    };
  }

  handleChangeStartDate(val) {
    if (val._isValid) {
      this.setState({
        start_date: val
      });
    }
  }

  handleChangeEndDate(val) {
    if (val._isValid) {
      this.setState({
        end_date: val
      });
    }
  }

  render() {
    let startDate = this.state.start_date == "" ? "" : this.state.start_date.format(CONSTANT.DATE_FORMAT);
    let endDate = this.state.end_date == "" ? "" : this.state.end_date.format(CONSTANT.DATE_FORMAT);

    let exportLink = `/admin/transactions/export.csv?start_date=${startDate}&end_date=${endDate}`;

    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="page-header">
                <Col md={6}>
                  <h3>Export Transactions</h3>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form horizontal>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Start Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker selected={this.state.start_date} onChange={::this.handleChangeStartDate} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        End Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker selected={this.state.end_date} onChange={::this.handleChangeEndDate} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel} />
                      <Col sm={9}>
                        <small>* leave one of above fields blank to export all transactions</small>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col sm={12} className="text-right">
                  <a href={exportLink} className="btn-outlined btn btn-primary">
                    Export
                  </a>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
