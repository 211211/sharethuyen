import React from "react";
import ReactDOM from "react-dom";

import BoatCard from "../components/boat/boat-card";
import BoatSharePagination from "../components/_core/boat-share-pagination";
import BoatShareTag from "../components/_core/boat-share-tag";
import { URL_CONFIG, CONSTANT } from "../common/config";
import AppUtil from "../common/util";

import {
  Button,
  Row,
  Col,
  Grid,
  Panel,
  PanelBody,
  PanelContainer,
  FormControl,
  FormGroup,
  Icon,
  PanelTabContainer,
  Nav,
  NavItem,
  PanelHeader,
  Badge
} from "@sketchpixy/rubix";

import SelectBoatClass from "../components/_core/select-boat-class";

export default class Boats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boats: [],
      items: 0,
      activePage: 1,
      boat_class: {
        id: -1,
        name: "VIEW ALL",
        color_hex: "#fff"
      },
      boat_classes: [],
      boat_statuses: [],
      status: CONSTANT.BOAT_STATUS["total"]
    };
  }

  componentDidMount() {
    $.getJSON(URL_CONFIG.boats_path_json).then(data => {
      var newState = this.state;
      newState.boats = data.boats;
      newState.items = AppUtil.getNumOfPage(data.meta.recordsTotal);
      newState.boat_classes = data.meta.boat_classes;
      newState.boat_statuses = data.meta.boat_statuses;
      this.setState(newState);
    });
  }

  openAddBoatForm() {
    this.props.router.push(`${URL_CONFIG.boats_path}/new`);
  }

  queryData(options) {
    var boat_class = this.state.boat_class.id == -1 ? "" : this.state.boat_class.id;
    var status = this.state.status == -1 ? "" : this.state.status;
    var paramObj = $.extend(
      {
        status: status,
        boat_class: boat_class
      },
      options
    );

    let url = URL_CONFIG.boats_path + AppUtil.buildQueryParam(paramObj);
    $.getJSON(url).then(data => {
      var newState = this.state;
      newState.boats = data.boats;
      newState.boat_classes = data.meta.boat_classes;
      newState.items = AppUtil.getNumOfPage(data.meta.recordsTotal);
      newState.boat_statuses = data.meta.boat_statuses;
      this.setState(newState);
    });
  }

  handleSelectStatus(eventKey) {
    this.state.status = CONSTANT.BOAT_STATUS[eventKey];
    this.state.activePage = 1;
    this.queryData();
  }

  onChangeBoatClass(val) {
    var newState = this.state;
    newState.boat_class = val;
    this.queryData();
  }

  onRemoveBoat(boat) {
    var newState = this.state;
    newState.boats.splice(newState.boats.indexOf(boat), 1);
    this.setState(newState);
  }

  render() {
    let { boats } = this.state;
    let boatsExist = boats && typeof boats.map === "function";

    let { boatClasses } = this.state;
    let { selBoatClasses } = this.state;
    let boat_status =
      this.state.boat_statuses.find(boat_status => {
        return this.state.status == CONSTANT.BOAT_STATUS[boat_status.key];
      }) || {};

    let boatCardTpl = (
      <Row className="boat-card-group">
        {boatsExist &&
          boats.map((boat, index) => {
            return (
              <div key={boat.id}>
                <div className="hidden-xs">
                  <div>
                    <Col sm={4}>
                      <BoatCard boat={boat} parent={this} />
                    </Col>
                    {(() => {
                      if ((index + 1) % 3 == 0) {
                        return <Row />;
                      }
                    })()}
                  </div>
                </div>
                <div className="hidden-sm hidden-md hidden-lg">
                  <div>
                    <Col xs={6}>
                      <BoatCard boat={boat} parent={this} />
                    </Col>
                    {(() => {
                      if ((index + 1) % 2 == 0) {
                        return <Row />;
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
      </Row>
    );

    return (
      <Grid className="boat-page">
        <Row>
          <Col md={12}>
            <Col md={6} />
            <Col md={6} className="page-top-nav">
              <Button className="pull-right" lg outlined bsStyle="primary" onClick={::this.openAddBoatForm}>
                Add
              </Button>{" "}
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <PanelTabContainer id="pills-basic" defaultActiveKey="total" className="container-overflow-visible">
            <PanelHeader className="bg-light-blue fg-white">
              <Grid>
                <Row>
                  <Col sm={12}>
                    <h3>Boat filter</h3>
                  </Col>
                </Row>
              </Grid>
            </PanelHeader>
            <PanelBody>
              <Grid>
                <Row>
                  <Col sm={12}>
                    <SelectBoatClass
                      showAllOption="1"
                      boat_class={this.state.boat_class}
                      boat_classes={this.state.boat_classes}
                      onChangeBoatClass={::this.onChangeBoatClass}
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                  <Col sm={12}>
                    <Nav bsStyle="pills" onSelect={::this.handleSelectStatus} className="nav-light-blue">
                      {(() => {
                        if (this.state.boat_statuses && typeof this.state.boat_statuses.map == "function") {
                          return this.state.boat_statuses.map(function(boat_status, index) {
                            return (
                              <NavItem key={index} eventKey={boat_status.key}>
                                {boat_status.name}
                                <Badge>{boat_status.count}</Badge>
                              </NavItem>
                            );
                          });
                        }
                      })()}
                    </Nav>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20, marginBottom: 20 }}>
                  <Col sm={12}>
                    VIEWING: {this.state.boat_class.name} - STATUS {boat_status.name}
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </PanelTabContainer>
        </Row>
        {boatCardTpl}
      </Grid>
    );
  }
}
