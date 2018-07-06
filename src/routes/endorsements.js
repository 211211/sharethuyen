import React from "react";
import ReactDOM from "react-dom";

import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Icon,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";

export default class Endorsements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
      season_setting: {
        season_start_date: moment(),
        season_end_date: moment()
      },
      security_deposit: {
        single_user: "",
        group_user: ""
      },
      submitDisabled: false
    };
  }

  componentDidMount(prevProps) {
    $.getJSON(`${URL_CONFIG.get_value_by_var_path}/endorsement_check_list`).then(res => {
      this.initForm(res.value);
    });
  }

  initForm(formData) {
    var defaults = {
      controlPosition: "right",
      controlOrder: ["checkbox", "checkbox-group", "text"],
      dataType: "json",
      disableFields: [
        "autocomplete",
        "radio-group",
        "button",
        "date",
        "file",
        "header",
        "hidden",
        "paragraph",
        "number",
        "select",
        "textarea"
      ],
      roles: {},
      editOnAdd: false,
      sortableControls: true
    };

    if (formData) {
      defaults.formData = formData;
    }
    var endorsementEditorEl = $(ReactDOM.findDOMNode(this.endorsementEditor));
    var formBuilder = endorsementEditorEl.formBuilder(defaults).data("formBuilder");

    $(".form-builder-save").click(function() {
      client
        .put(URL_CONFIG.update_batch_settings_path, {
          settings: [
            {
              key: "endorsement_check_list",
              value: formBuilder.formData
            }
          ]
        })
        .then(res => {
          //Do nothing
        });
    });
  }

  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid style={{ marginBottom: 10 }}>
              <Form horizontal>
                <Row className="panel-header">
                  <Col md={12}>
                    <Col md={6}>
                      <h4>Endorsements</h4>
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <div ref={c => (this.endorsementEditor = c)} />
                  </Col>
                </Row>
              </Form>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
