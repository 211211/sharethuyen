import React from "react";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import {
  Button,
  Modal,
  FormGroup,
  Row,
  Radio,
  Col,
  ControlLabel,
  FormControl,
  Image,
  Media,
  Checkbox
} from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";

@inject("newBookingStore")
@observer
export default class BoatSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      boats: [],
      boats_other_classes: [],
      selectedBoat: {},
      loaded: false,
      override: false,
      overrideConfirmed: false
    };
    this.onChangeBoat = this.onChangeBoat.bind(this);
    this.onChangeOverrideConfirmed = this.onChangeOverrideConfirmed.bind(this);
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  setLoaded(loaded) {
    this.setState({
      loaded: loaded
    });
  }

  close() {
    this.setState({
      showModal: false
    });
  }

  open(selectedBoat) {
    this.setState({
      selectedBoat: selectedBoat || {},
      showModal: true,
      loaded: false,
      override: false,
      overrideConfirmed: false
    });
    client
      .get(`${URL_CONFIG.get_boat_available_for_assigning_path}`, {
        boat_class_id: this.props.boat_class.id,
        start_date: this.props.booking_start_date.format(CONSTANT.DATE_FORMAT),
        end_date: this.props.booking_end_date.format(CONSTANT.DATE_FORMAT)
      })
      .then(
        res => {
          this.setState({
            boats: res.boats,
            boats_other_classes: res.boats_other_classes,
            loaded: true
          });
        },
        () => {
          this.setState({
            loaded: true
          });
        }
      );
  }

  ok() {
    const { selectedBoat, overrideConfirmed } = this.state;
    this.props.resolvedFn(selectedBoat, overrideConfirmed);
  }

  onChangeBoat(boat, override) {
    this.setState({
      selectedBoat: boat,
      override: override
    });
  }

  onChangeOverrideConfirmed(e) {
    const overrideConfirmed = e.target.checked;
    this.setState({
      overrideConfirmed
    });
  }

  render() {
    const { state, onChangeOverrideConfirmed, onChangeBoat, booking } = this;
    const { boat_class_ids } = booking.user;
    const { loaded, boats_other_classes, boats, override, overrideConfirmed } = state;
    const okDisabled = !loaded || (override && !overrideConfirmed);

    const boatsEndorsedOtherClasses = boats_other_classes.filter(boat => {
      return boat_class_ids.indexOf(boat.boat_class_id) !== -1;
    });

    const boatsNotEndorsedOtherClasses = boats_other_classes.filter(boat => {
      return boat_class_ids.indexOf(boat.boat_class_id) == -1;
    });

    let boats_tpl =
      boats.length > 0 ? (
        boats.map(boat => {
          return this.renderBoatSelect(boat, false);
        })
      ) : (
        <div>There is no boats in booking class available to assign or change</div>
      );

    let boatsEndorsedOtherClassesTpl = boatsEndorsedOtherClasses.map(boat => {
      return this.renderBoatSelect(boat);
    });

    let boatsNotEndorsedOtherClassesTpl = boatsNotEndorsedOtherClasses.map(boat => {
      return this.renderBoatSelect(boat, true);
    });

    return (
      <Modal className="select-boat-modal" show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose A Boat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={loaded} />
          <Row className="form-horizontal boats-list">
            <Col md={12} className={loaded ? "" : "is-loading"}>
              <FormGroup>
                {loaded && (
                  <div>
                    {boats_tpl}
                    {boatsEndorsedOtherClasses.length > 0 && (
                      <div>
                        <div className="override-the-boat">Boats available in other classes</div>
                        {boatsEndorsedOtherClassesTpl}
                      </div>
                    )}
                    {boatsNotEndorsedOtherClasses.length > 0 && (
                      <div>
                        <div className="override-the-boat">
                          Please select from the list of boats below if you wish to admin override the boat for this
                          booking
                        </div>
                        {boatsNotEndorsedOtherClassesTpl}
                      </div>
                    )}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {override && (
            <Checkbox
              checked={overrideConfirmed}
              onChange={onChangeOverrideConfirmed}
              style={{ textAlign: "left", marginTop: 0 }}
            >
              This user is not endorsed to use this boat. Confirm for the overriden
            </Checkbox>
          )}
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.ok} disabled={okDisabled} bsStyle="primary">
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderBoatSelect(boat, override) {
    return (
      <Radio
        className="boat-select-radio"
        defaultValue={boat.id}
        key={boat.id}
        onChange={() => {
          this.onChangeBoat(boat, override);
        }}
        checked={this.state.selectedBoat.id == boat.id}
        disabled={boat.status == "need_attention" || boat.status == "processing"}
      >
        <Media>
          <Media.Left>
            <img height={80} src={boat.primary_image} alt="Image" />
          </Media.Left>
          <Media.Body>
            <p className="boat-name">{boat.name}</p>
            <span className="boat-info">{boat.status_humanized}</span>
            <span className="boat-info">Fuel Remain: {boat.fuel_remain} x 1/16th</span>
          </Media.Body>
        </Media>
      </Radio>
    );
  }
}
