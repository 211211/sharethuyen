import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Toggle from "react-toggle";

import { Col, Form, FormGroup, FormControl, ControlLabel, Icon, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import BoatShareGallery from "../_core/boat-share-gallery";
import BoatUtil from "./boat-util";
import SelectChecklist from "./select-checklist";

export default class BoatForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boat: BoatUtil.mapBoat(props.boat),

      // Selected boat_amenities
      sel_boat_amenities: [],

      // All available boat_amenities
      boat_amenities: [],

      // All images to be uploaded
      toBeUploadImages: []
    };
    this.state.boat.amenity_ids = this.getAmenityIds(props.boat.boat_amenities);
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;

    newState.boat = BoatUtil.mapBoat(nextProps.boat);
    newState.boat.amenity_ids = this.getAmenityIds(nextProps.boat.boat_amenities);

    //Build selected boat amenity list
    //only for first time
    if (newState.sel_boat_amenities.length == 0) {
      newState.sel_boat_amenities = this.state.boat_amenities.filter(boat_amenity => {
        return newState.boat.amenity_ids.indexOf(boat_amenity.id) != -1;
      });
    }
    this.setState(newState);
  }

  componentDidMount() {
    client.get(URL_CONFIG.admin_boat_classes_search_path).then(res => {
      var newState = this.state;
      newState.boatClasses = res;
      this.setState(newState);
    });

    client.get(URL_CONFIG.search_boat_amenities_path).then(res => {
      var newState = this.state;
      newState.boat_amenities = res;

      //Build selected boat amenity list
      newState.sel_boat_amenities = res.filter(boat_amenity => {
        return newState.boat.amenity_ids.indexOf(boat_amenity.id) != -1;
      });
      this.setState(newState);
    });
  }

  //Build list of amenity ids
  getAmenityIds(boat_amenities) {
    var amenity_ids = [];
    if (boat_amenities && typeof boat_amenities.map == "function") {
      amenity_ids = boat_amenities.map(function(boat_amenity) {
        return boat_amenity.id;
      });
    }
    return amenity_ids;
  }

  onChangeBoatClass(e) {
    this.props.parent.handleFieldChange("boat_class_id", e.target.value);
  }

  handleChangeFile(e) {
    this.props.parent.handleFieldChange("image", e.target.files);
  }

  handleChangeBoatStatus(e) {
    this.props.parent.handleFieldChange("status", e.target.value);
  }

  handleChangeYardEndDate(value) {
    if (value) {
      const dateInTimeZone = moment(value.format(CONSTANT.DATE_FORMAT));
      this.props.parent.handleFieldChange("yard_end_date", dateInTimeZone);
    } else {
      this.props.parent.handleFieldChange("yard_end_date", value);
    }
  }

  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.props.parent.handleFieldChange(name, value);
  }

  handleRemoveImage(e) {
    var index = $(e.currentTarget).data("index");
    this.props.parent.handleRemoveFile(index);
  }

  onSelectAmenity(val) {
    this.props.parent.handleFieldChange("boat_amenities", val);
    this.props.parent.handleFieldChange("amenity_ids", this.getAmenityIds(val));
    var newState = this.state;
    newState.sel_boat_amenities = val;
    this.setState(newState);
  }

  onChangeChecklist(sel_checklists) {
    var newState = this.state;
    let checklist_ids = sel_checklists.map(checklist => {
      return checklist.id;
    });
    newState.boat.checklist_ids = checklist_ids;
    this.setState(newState);
    this.props.parent.handleFieldChange("booking_checklist_category_ids", checklist_ids);
  }

  optionRendererFn(option) {
    return (
      <p className="boat-amenity-select-item">
        <img src={option.thumb_url} className="boat-amenity-icon" />
        {option.name}
      </p>
    );
  }

  render() {
    var gallery;
    let { boatClasses } = this.state;
    let { boat } = this.state;
    let boatClassesExist = boatClasses && typeof boatClasses.map === "function";
    let isYardStatus = CONSTANT.BOAT_STATUS[boat.status] == CONSTANT.BOAT_STATUS["yard"];

    if (
      typeof this.props.boat.boat_images != "undefined" &&
      typeof this.props.boat.boat_images.map == "function" &&
      this.props.boat.boat_images.length > 0
    ) {
      gallery = (
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Gallery
          </Col>
          <Col sm={9}>
            <BoatShareGallery
              boat_images={this.props.boat.boat_images}
              onSelectPrimaryImage={this.props.onSelectPrimaryImage}
              onRemoveImage={this.props.onRemoveImage}
            />
          </Col>
        </FormGroup>
      );
    }

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="Name"
              value={boat.name}
              name="name"
              autoFocus
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="dropdownselect">
          <Col sm={3} componentClass={ControlLabel}>
            Boat Class <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={boat.boat_class_id}
              onChange={::this.onChangeBoatClass}
            >
              <option value="-1">- Please choose -</option>
              {boatClassesExist &&
                boatClasses.map((boatClass, index) => {
                  return (
                    <option key={boatClass.id} value={boatClass.id}>
                      {boatClass.name}
                    </option>
                  );
                })}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup controlId="dropdownselect">
          <Col sm={3} componentClass={ControlLabel}>
            Boat Status
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              value={boat.status}
              onChange={::this.handleChangeBoatStatus}
            >
              {boat.statuses.map(statusObj => {
                return (
                  <option key={statusObj.key} value={statusObj.key}>
                    {statusObj.name}
                  </option>
                );
              })}
            </FormControl>
          </Col>
        </FormGroup>
        {(() => {
          if (isYardStatus) {
            return (
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Yard End Date
                </Col>
                <Col sm={9}>
                  <DatePicker
                    isClearable={true}
                    selected={boat.yard_end_date}
                    onChange={::this.handleChangeYardEndDate}
                  />
                </Col>
              </FormGroup>
            );
          }
        })()}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Description
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="Description"
              componentClass="textarea"
              name="description"
              rows="3"
              value={boat.description}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Image
          </Col>
          <Col sm={9}>
            <FormControl type="file" multiple onChange={::this.handleChangeFile} />
          </Col>
        </FormGroup>
        {(() => {
          if (this.props.toBeUploadImages.length > 0) {
            return (
              <FormGroup>
                <Col sm={3} />
                <Col sm={9}>
                  {this.props.toBeUploadImages.map((image, index) => {
                    return (
                      <p key={index} className="upload-image-item">
                        <button type="button" className="close" data-index={index} onClick={::this.handleRemoveImage}>
                          <span aria-hidden="true">×</span>
                        </button>
                        {image.image_url.name}
                      </p>
                    );
                  })}
                </Col>
              </FormGroup>
            );
          }
        })()}

        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Year
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Year"
              name="year"
              value={boat.year}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Length
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Length"
              name="length"
              value={boat.length}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Engine
          </Col>
          <Col sm={9}>
            <FormControl placeholder="Engine" name="engine" value={boat.engine} onChange={::this.handleChangeInput} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Engine Hours
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Engine Hours"
              name="engine_hours"
              value={boat.engine_hours}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Comfortably Seats
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Comfortably Seats"
              name="seating"
              value={boat.seating}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Fuel Capacity
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Fuel Capacity"
              name="capacity"
              value={boat.capacity}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            ID
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="ID"
              name="identifier"
              value={boat.identifier}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Cruising Speed
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="Cruising Speed"
              name="cruising_speed"
              value={boat.cruising_speed}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            US Coast Guard Capacity
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="US Coast Guard Capacity"
              name="us_coast_guard_capacity"
              value={boat.us_coast_guard_capacity}
              onChange={::this.handleChangeInput}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Fuel Meter Enabled
          </Col>
          <Col sm={9}>
            <label>
              <Toggle name="fuel_meter_enabled" checked={boat.fuel_meter_enabled} onChange={::this.handleChangeInput} />
            </label>
          </Col>
        </FormGroup>
        {boat.fuel_meter_enabled && (
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Fuel Meter
            </Col>
            <Col sm={9}>
              <FormControl.Static>{boat.fuel_meter}</FormControl.Static>
            </Col>
          </FormGroup>
        )}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Fuel Remain
          </Col>
          <Col sm={9}>
            <FormControl.Static>{boat.fuel_remain} x 1/16th</FormControl.Static>
          </Col>
        </FormGroup>
        {!boat.fuel_meter_enabled && (
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Rate of Burn <span className="req-field">*</span>
            </Col>
            <Col sm={9}>
              <FormControl
                placeholder="Rate of Burn (gallons per 1/16th)"
                name="fuel_rate_of_burn"
                type="number"
                value={boat.fuel_rate_of_burn}
                onChange={::this.handleChangeInput}
              />
            </Col>
          </FormGroup>
        )}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Amenities
          </Col>
          <Col sm={9}>
            <Select
              name="form-field-name"
              value={this.state.sel_boat_amenities}
              multi={true}
              labelKey="name"
              valueKey="id"
              options={this.state.boat_amenities}
              optionRenderer={::this.optionRendererFn}
              onChange={::this.onSelectAmenity}
            />
          </Col>
        </FormGroup>
        <SelectChecklist
          checklist_ids={this.state.boat.booking_checklist_category_ids}
          onChangeChecklist={::this.onChangeChecklist}
        />
        {gallery}
      </Form>
    );
  }
}
