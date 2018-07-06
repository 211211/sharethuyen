import React from "react";
import Select from "react-select";

import { FormGroup, Col, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config.js";

export default class SelectChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checklist_ids: props.checklist_ids || [],
      checklists: []
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.checklist_ids = nextProps.checklist_ids;
    this.setState(newState);
  }

  componentDidMount() {
    $.getJSON(`${URL_CONFIG.search_booking_checklist_categories_path}`).then(res => {
      var newState = this.state;
      newState.checklists = res;
      this.setState(newState);
    });
  }

  optionRendererFn(option) {
    return <span>{option.name}</span>;
  }

  render() {
    let { checklist_ids } = this.state;
    let { checklists } = this.state;

    let sel_checklists = checklist_ids.map(checklist_id => {
      let found_checklist = checklists.find(checklist => {
        return checklist.id == checklist_id;
      });
      return found_checklist;
    });
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          Booking Checklist
        </Col>
        <Col sm={9}>
          <Select
            name="booking-checklist-field"
            value={sel_checklists}
            multi={true}
            labelKey="name"
            valueKey="id"
            options={checklists}
            optionRenderer={::this.optionRendererFn}
            onChange={::this.props.onChangeChecklist}
          />
        </Col>
      </FormGroup>
    );
  }
}
