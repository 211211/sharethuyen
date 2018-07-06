import React from "react";

import { Button, ControlLabel, Grid, Row, Col, FormControl } from "@sketchpixy/rubix";

export default class BoatShareTag extends React.Component {
  constructor(props) {
    super(props);
  }

  onMouseEnterTag(e) {
    var el = $(e.target);
    el.data("name", el.html());
    el.width(el.width());
    el.html("X");
  }

  onMouseLeaveTag(e) {
    var el = $(e.target);
    el.html(el.data("name"));
  }

  onMouseClickTag(tag) {
    this.props.onRemoveTag(tag);
  }

  onMouseSelectTag(e) {
    var el = $(e.target);
    this.props.onAddingTag(el.val());
  }

  render() {
    let { tags } = this.props;
    let tagsExist = tags && typeof tags.map === "function";

    let { selelectableTags } = this.props;
    let selelectableTagsExist = selelectableTags && typeof selelectableTags.map === "function";

    let tagTpl = (
      <div>
        {tagsExist &&
          tags.map((tag, index) => {
            var boundClick = this.onMouseClickTag.bind(this, tag);
            return (
              <Button
                outlined
                key={tag.id}
                onMouseEnter={::this.onMouseEnterTag}
                onMouseLeave={::this.onMouseLeaveTag}
                onClick={boundClick}
                bsStyle="lightgreen"
                style={{ marginLeft: 5 }}
              >
                {tag.name}
              </Button>
            );
          })}
      </div>
    );

    let tagSelectTpl = (
      <FormControl componentClass="select" placeholder="select" onChange={::this.onMouseSelectTag}>
        <option value="-1">- Please choose -</option>
        {selelectableTagsExist &&
          selelectableTags.map((tag, index) => {
            return (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            );
          })}
      </FormControl>
    );

    return (
      <div>
        <Row>
          <Col sm={2} className="filter-by-class-label">
            <ControlLabel>By class</ControlLabel>
          </Col>
          <Col sm={10}>{tagSelectTpl}</Col>
        </Row>
        <Row style={{ marginTop: 15, marginBottom: 15 }}>
          <Col sm={2} className="filter-by-class-label" />
          <Col sm={10}>{tagTpl}</Col>
        </Row>
      </div>
    );
  }
}
