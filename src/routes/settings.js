import React from "react";
import DatePicker from "react-datepicker";
import Toggle from "react-toggle";
import moment from "moment";
import Select from "react-select";
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";
import { map, includes } from "lodash/collection";
import { isEmpty } from "lodash/lang";
import { inject, observer } from "mobx-react";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";
import SettingHoliday from "../components/setting/setting-holiday";
import MaintenanceSwitch from "../components/setting/maintenance-switch";

import MembershipTypeUtil from "../common/membership-type-util";
import SettingMessage from "../components/setting/setting-message";

@inject("store")
export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    let user_types = map(CONSTANT.MEMBERSHIP_TYPE, function(type) {
      return { value: type, label: type, name: type };
    });

    this.state = {
      down_for_maintenance: false,
      settings: [],
      season_setting: {
        season_start_date: moment(),
        season_end_date: moment(),
        peak_season_start_date: moment(),
        peak_season_end_date: moment()
      },
      refuel_level: "",
      user_types: user_types,
      disabled_user_types: [],
      security_deposit: {
        daily_user: "",
        single_user: "",
        mid_week_user: "",
        unlimited_user: "",
        group_user: ""
      },
      membership: {
        daily_user: "",
        single_user: "",
        mid_week_user: "",
        unlimited_user: "",
        group_user: ""
      },
      holidays: [],
      pending_charge_message: "",
      ui_booking_intro: "",
      ui_booking_hh_intro: "",
      t_and_c_on_check_out: "",
      cancellation_policy: "",
      no_show_cancel_fee_unlimited_msg: "",
      cancel_fee_unlimited_msg: "",
      no_show_fee_msg: "",
      gallon_price: "",
      lesson_discount_percent: "",
      sale_tax_percent: 8,
      booking_charge_sale_tax: false,
      fuel_charge_sale_tax: false,
      cleaning_charge_sale_tax: false,
      damage_charge_sale_tax: false,
      other_charge_sale_tax: false,
      security_deposit_charge_sale_tax: false,
      membership_charge_sale_tax: false,
      lesson_charge_sale_tax: false,
      auto_fee_charge_sale_tax: false,
      e_commerce_charge_sale_tax: false,
      submitDisabled: false,
      boat_classes: [],
      paid_boat_classes: [],
      happy_hour_enabled: true,
      default_user_type: ""
    };
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  componentDidMount(prevProps) {
    let { id } = this.props.params;
    client.get(URL_CONFIG.settings_path).then(res => {
      var newState = this.transformSettingData(res);
      this.setState(newState);
    });
    client.get(`${URL_CONFIG.admin_boat_classes_search_path}`).then(res => {
      this.setState({
        boat_classes: res
      });
    });
  }

  transformSettingData(settingObj) {
    var newState = this.state;
    if (settingObj.refuel_level) {
      newState.refuel_level = settingObj.refuel_level;
    } else {
      newState.refuel_level = 0.25;
    }
    newState.down_for_maintenance = settingObj.down_for_maintenance || false;
    newState.season_setting.season_start_date = moment(settingObj.season_start_date);
    newState.season_setting.season_end_date = moment(settingObj.season_end_date);
    newState.season_setting.peak_season_start_date = moment(settingObj.peak_season_start_date);
    newState.season_setting.peak_season_end_date = moment(settingObj.peak_season_end_date);
    newState.security_deposit.daily_user = settingObj.security_deposit_daily_user;
    newState.security_deposit.single_user = settingObj.security_deposit_single_user;
    newState.security_deposit.mid_week_user = settingObj.security_deposit_mid_week_user;
    newState.security_deposit.unlimited_user = settingObj.security_deposit_unlimited_user;
    newState.security_deposit.group_user = settingObj.security_deposit_group_user;
    newState.membership.daily_user = settingObj.membership_daily_user;
    newState.membership.single_user = settingObj.membership_single_user;
    newState.membership.mid_week_user = settingObj.membership_mid_week_user;
    newState.membership.unlimited_user = settingObj.membership_unlimited_user;
    newState.membership.group_user = settingObj.membership_group_user;
    newState.gallon_price = settingObj.gallon_price;
    newState.pending_charge_message = settingObj.pending_charge_message;
    newState.ui_booking_intro = settingObj.ui_booking_intro;
    newState.ui_booking_hh_intro = settingObj.ui_booking_hh_intro;
    newState.t_and_c_on_check_out = settingObj.t_and_c_on_check_out;
    newState.cancellation_policy = settingObj.cancellation_policy;
    newState.no_show_cancel_fee_unlimited_msg = settingObj.no_show_cancel_fee_unlimited_msg;
    newState.cancel_fee_unlimited_msg = settingObj.cancel_fee_unlimited_msg;
    newState.no_show_fee_msg = settingObj.no_show_fee_msg;
    newState.lesson_discount_percent = settingObj.lesson_discount_percent;
    newState.sale_tax_percent = settingObj.sale_tax_percent;
    newState.booking_charge_sale_tax = settingObj.booking_charge_sale_tax || false;
    newState.fuel_charge_sale_tax = settingObj.fuel_charge_sale_tax || false;
    newState.cleaning_charge_sale_tax = settingObj.cleaning_charge_sale_tax || false;
    newState.damage_charge_sale_tax = settingObj.damage_charge_sale_tax || false;
    newState.other_charge_sale_tax = settingObj.other_charge_sale_tax || false;
    newState.security_deposit_charge_sale_tax = settingObj.security_deposit_charge_sale_tax || false;
    newState.membership_charge_sale_tax = settingObj.membership_charge_sale_tax || false;
    newState.lesson_charge_sale_tax = settingObj.lesson_charge_sale_tax || false;
    newState.auto_fee_charge_sale_tax = settingObj.auto_fee_charge_sale_tax || false;
    newState.e_commerce_charge_sale_tax = settingObj.e_commerce_charge_sale_tax || false;
    newState.happy_hour_enabled = settingObj.happy_hour_enabled;
    newState.paid_boat_classes = settingObj.paid_boat_classes || [];
    newState.disabled_user_types = settingObj.disabled_user_types || [];
    newState.default_user_type = settingObj.default_user_type || "";
    if (settingObj.holidays) {
      newState.holidays = JSON.parse(settingObj.holidays);
    } else {
      newState.holidays = [];
    }
    return newState;
  }

  transformSubmitData() {
    var settings = [];
    settings.push({
      key: "season_start_date",
      value: this.state.season_setting.season_start_date.format(CONSTANT.DATE_FORMAT)
    });
    settings.push({
      key: "refuel_level",
      value: parseFloat(this.state.refuel_level)
    });
    settings.push({
      key: "season_end_date",
      value: this.state.season_setting.season_end_date.format(CONSTANT.DATE_FORMAT)
    });
    settings.push({
      key: "peak_season_start_date",
      value: this.state.season_setting.peak_season_start_date.format(CONSTANT.DATE_FORMAT)
    });
    settings.push({
      key: "peak_season_end_date",
      value: this.state.season_setting.peak_season_end_date.format(CONSTANT.DATE_FORMAT)
    });
    settings.push({
      key: "security_deposit_daily_user",
      value: this.state.security_deposit.daily_user
    });
    settings.push({
      key: "security_deposit_single_user",
      value: this.state.security_deposit.single_user
    });
    settings.push({
      key: "security_deposit_mid_week_user",
      value: this.state.security_deposit.mid_week_user
    });
    settings.push({
      key: "security_deposit_unlimited_user",
      value: this.state.security_deposit.unlimited_user
    });
    settings.push({
      key: "security_deposit_group_user",
      value: this.state.security_deposit.group_user
    });
    settings.push({
      key: "membership_daily_user",
      value: this.state.membership.daily_user
    });
    settings.push({
      key: "membership_single_user",
      value: this.state.membership.single_user
    });
    settings.push({
      key: "membership_mid_week_user",
      value: this.state.membership.mid_week_user
    });
    settings.push({
      key: "membership_unlimited_user",
      value: this.state.membership.unlimited_user
    });
    settings.push({
      key: "membership_group_user",
      value: this.state.membership.group_user
    });
    settings.push({
      key: "gallon_price",
      value: this.state.gallon_price
    });

    const keys = [
      "pending_charge_message",
      "ui_booking_intro",
      "ui_booking_hh_intro",
      "t_and_c_on_check_out",
      "cancellation_policy",
      "no_show_cancel_fee_unlimited_msg",
      "cancel_fee_unlimited_msg",
      "no_show_fee_msg",
      "lesson_discount_percent",
      "sale_tax_percent",
      "booking_charge_sale_tax",
      "fuel_charge_sale_tax",
      "cleaning_charge_sale_tax",
      "damage_charge_sale_tax",
      "other_charge_sale_tax",
      "security_deposit_charge_sale_tax",
      "membership_charge_sale_tax"
    ];
    _.each(keys, key => {
      settings.push({
        key: key,
        value: this.state[key]
      });
    });
    settings.push({
      key: "lesson_charge_sale_tax",
      value: this.state.lesson_charge_sale_tax
    });
    settings.push({
      key: "auto_fee_charge_sale_tax",
      value: this.state.auto_fee_charge_sale_tax
    });
    settings.push({
      key: "e_commerce_charge_sale_tax",
      value: this.state.e_commerce_charge_sale_tax
    });
    settings.push({
      key: "paid_boat_classes",
      value: this.state.paid_boat_classes
    });
    settings.push({
      key: "disabled_user_types",
      value: this.state.disabled_user_types
    });
    settings.push({
      key: "default_user_type",
      value: this.state.default_user_type
    });
    settings.push({
      key: "happy_hour_enabled",
      value: this.state.happy_hour_enabled
    });

    let { holidays } = this.state;
    if (holidays.length > 0) {
      let submitHolidays = holidays.map(holiday => {
        return {
          name: holiday.name,
          date: holiday.date.format(CONSTANT.DATE_FORMAT)
        };
      });
      settings.push({
        key: "holidays",
        value: JSON.stringify(submitHolidays)
      });
    }
    return settings;
  }

  handleChangeSeasonStartDate(val) {
    if (val._isValid) {
      var newState = this.state;
      newState.season_setting.season_start_date = val;
      this.setState(newState);
    }
  }

  handleChangeSeasonEndDate(val) {
    if (val._isValid) {
      var newState = this.state;
      newState.season_setting.season_end_date = val;
      this.setState(newState);
    }
  }

  handleChangePeakSeasonStartDate(val) {
    if (val._isValid) {
      var newState = this.state;
      newState.season_setting.peak_season_start_date = val;
      this.setState(newState);
    }
  }

  handleChangePeakSeasonEndDate(val) {
    if (val._isValid) {
      var newState = this.state;
      newState.season_setting.peak_season_end_date = val;
      this.setState(newState);
    }
  }

  handleChangeDepositSingleUser(e) {
    var newState = this.state;
    newState.security_deposit.single_user = e.target.value;
    this.setState(newState);
  }

  handleChangeDepositDailyUser(e) {
    var newState = this.state;
    newState.security_deposit.daily_user = e.target.value;
    this.setState(newState);
  }

  handleChangeDepositMidWeekUser(e) {
    var newState = this.state;
    newState.security_deposit.mid_week_user = e.target.value;
    this.setState(newState);
  }

  handleChangeDepositUnlimitedUser(e) {
    var newState = this.state;
    newState.security_deposit.unlimited_user = e.target.value;
    this.setState(newState);
  }

  handleChangeDepositGroupUser(e) {
    var newState = this.state;
    newState.security_deposit.group_user = e.target.value;
    this.setState(newState);
  }

  handleChangeMembershipSingleUser(e) {
    var newState = this.state;
    newState.membership.single_user = e.target.value;
    this.setState(newState);
  }

  handleChangeMembershipDailyUser(e) {
    var newState = this.state;
    newState.membership.daily_user = e.target.value;
    this.setState(newState);
  }

  handleChangeMembershipMidWeekUser(e) {
    var newState = this.state;
    newState.membership.mid_week_user = e.target.value;
    this.setState(newState);
  }

  handleChangeMembershipUnlimitedUser(e) {
    var newState = this.state;
    newState.membership.unlimited_user = e.target.value;
    this.setState(newState);
  }

  handleChangeMembershipGroupUser(e) {
    var newState = this.state;
    newState.membership.group_user = e.target.value;
    this.setState(newState);
  }

  handleChangePaidBoatClasses(selectedArray) {
    this.setState({
      paid_boat_classes: selectedArray.map(function(s) {
        return s.id;
      })
    });
  }

  handleChangeDisabledUserTypes(types) {
    let disabledUserTypes = types.map(function(type) {
      return type.value;
    });
    let defaultUserType = this.state.default_user_type;

    if (includes(disabledUserTypes, defaultUserType)) {
      defaultUserType = "";
    }
    this.setState({
      disabled_user_types: disabledUserTypes,
      default_user_type: defaultUserType
    });
  }

  handleChangeDefaultUserType(type) {
    this.setState({
      default_user_type: type.value
    });
  }

  handleChangeChargeSaleTax(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleChangeValue(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  setSubmitDisable(val) {
    var newState = this.state;
    newState.submitDisabled = val;
    this.setState(newState);
  }

  handleAddHoliday() {
    let newState = this.state;
    newState.holidays.push({
      name: "",
      date: moment().format(CONSTANT.DATE_FORMAT)
    });
    this.setState(newState);
  }

  handleRemoveHoliday(holiday) {
    let newState = this.state;
    let { holidays } = this.state;
    let pos = holidays.indexOf(holiday);
    holidays.splice(pos, 1);
    this.setState(newState);
  }

  isSettingValid() {
    const { state } = this;
    const refuel_level = parseFloat(state.refuel_level);
    if (refuel_level <= 0 || refuel_level >= 1) {
      util.growlError(`Refuel Level need to be greater than 0 and less than 1`);
      return false;
    }

    if (isEmpty(this.state.default_user_type)) {
      util.growlError("Must select Default User Type");
      return false;
    }

    return true;
  }

  onSubmitFn() {
    if (!this.isSettingValid()) return;
    this.setSubmitDisable(true);
    client
      .put(URL_CONFIG.update_batch_settings_path, {
        settings: this.transformSubmitData()
      })
      .then(
        res => {
          util.growl(res.message);
          this.props.store.updateSettings(res.settings);
          this.setSubmitDisable(false);
        },
        response => {
          this.setSubmitDisable(false);
        }
      );
  }

  boatClassRendererFn(option) {
    return (
      <p className="boat-class-select-item">
        <span className="color-swatch-select" style={{ backgroundColor: option.color_hex }} />
        {option.name}
      </p>
    );
  }

  userTypeRendererFn(option) {
    return <p className="user-type-select-item">{option.label}</p>;
  }

  render() {
    const { handleChangeSetting, state, handleChangeValue } = this;
    const {
      lesson_discount_percent,
      refuel_level,
      holidays,
      gallon_price,
      sale_tax_percent,
      down_for_maintenance,
      pending_charge_message,
      ui_booking_intro,
      ui_booking_hh_intro,
      t_and_c_on_check_out,
      cancellation_policy,
      no_show_cancel_fee_unlimited_msg,
      cancel_fee_unlimited_msg,
      no_show_fee_msg
    } = state;

    let disabledUserTypes = this.state.disabled_user_types;
    let availableUserTypes = MembershipTypeUtil.removeDisabledMembershipType(this.state.user_types, disabledUserTypes);

    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Form horizontal>
                <Row className="panel-header">
                  <Col md={12}>
                    <Col md={6}>
                      <h3>Settings</h3>
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <MaintenanceSwitch
                      handleChangeSetting={handleChangeSetting.bind(this)}
                      down_for_maintenance={down_for_maintenance}
                    />
                    <Col md={12}>
                      <h4 className="section-form-title">Season Configuration</h4>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Season Start Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker
                          selected={this.state.season_setting.season_start_date}
                          onChange={::this.handleChangeSeasonStartDate}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Peak Season Start Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker
                          selected={this.state.season_setting.peak_season_start_date}
                          onChange={::this.handleChangePeakSeasonStartDate}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Peak Season End Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker
                          selected={this.state.season_setting.peak_season_end_date}
                          onChange={::this.handleChangePeakSeasonEndDate}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Season End Date
                      </Col>
                      <Col sm={9}>
                        <DatePicker
                          selected={this.state.season_setting.season_end_date}
                          onChange={::this.handleChangeSeasonEndDate}
                        />
                      </Col>
                    </FormGroup>

                    <Col md={12}>
                      <h4 className="section-form-title">Features</h4>
                      <p>You can turn features on or off here</p>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Happy hour
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="happy_hour_enabled"
                            checked={this.state.happy_hour_enabled}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>

                    <Col md={12}>
                      <h4 className="section-form-title">User types</h4>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Disable User Types
                      </Col>
                      <Col sm={9}>
                        <Select
                          multi={true}
                          name="disable-user-types-field"
                          value={disabledUserTypes}
                          labelKey="label"
                          valueKey="value"
                          joinValues={true}
                          options={this.state.user_types}
                          optionRenderer={::this.userTypeRendererFn}
                          onChange={::this.handleChangeDisabledUserTypes}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Default User Type
                      </Col>
                      <Col sm={9}>
                        <Select
                          name="disable-user-types-field"
                          value={this.state.default_user_type}
                          labelKey="label"
                          valueKey="value"
                          options={availableUserTypes}
                          optionRenderer={::this.userTypeRendererFn}
                          onChange={::this.handleChangeDefaultUserType}
                        />
                      </Col>
                    </FormGroup>

                    <Col md={12}>
                      <h4 className="section-form-title">Security Deposit</h4>
                    </Col>

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.daily)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Daily User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.security_deposit.daily_user}
                                onChange={::this.handleChangeDepositDailyUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.full)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Full User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.security_deposit.single_user}
                                onChange={::this.handleChangeDepositSingleUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.mid_week)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Mid week User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.security_deposit.mid_week_user}
                                onChange={::this.handleChangeDepositMidWeekUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.unlimited)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Unlimited User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.security_deposit.unlimited_user}
                                onChange={::this.handleChangeDepositUnlimitedUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.shared)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Group User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.security_deposit.group_user}
                                onChange={::this.handleChangeDepositGroupUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    <Col md={12}>
                      <h4 className="section-form-title">Membership</h4>
                    </Col>
                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.daily)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Daily User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.membership.daily_user}
                                onChange={::this.handleChangeMembershipDailyUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.full)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Full User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.membership.single_user}
                                onChange={::this.handleChangeMembershipSingleUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.mid_week)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Mid week User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.membership.mid_week_user}
                                onChange={::this.handleChangeMembershipMidWeekUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.unlimited)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Unlimited User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.membership.unlimited_user}
                                onChange={::this.handleChangeMembershipUnlimitedUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    {(() => {
                      if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.shared)) {
                        return (
                          <FormGroup>
                            <Col sm={3} componentClass={ControlLabel}>
                              Group User
                            </Col>
                            <Col sm={9}>
                              <FormControl
                                type="number"
                                value={this.state.membership.group_user}
                                onChange={::this.handleChangeMembershipGroupUser}
                              />
                            </Col>
                          </FormGroup>
                        );
                      }
                    })()}

                    <Col md={12}>
                      <h4 className="section-form-title">Pricing</h4>
                    </Col>
                    <SettingFormGroup
                      label="Gallon Price"
                      type="number"
                      value={gallon_price}
                      onChange={value => {
                        handleChangeSetting.call(this, "gallon_price", value);
                      }}
                    />
                    <Col md={12}>
                      <h4 className="section-form-title">Refuel Level</h4>
                    </Col>
                    <SettingFormGroup
                      label="Refuel Level"
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                      value={refuel_level}
                      onChange={value => {
                        handleChangeSetting.call(this, "refuel_level", value);
                      }}
                    />
                    <Col md={12}>
                      <h4 className="section-form-title">Lessons</h4>
                    </Col>
                    <SettingFormGroup
                      label="Discount for Paid members (%)"
                      type="number"
                      value={lesson_discount_percent}
                      onChange={value => {
                        handleChangeSetting.call(this, "lesson_discount_percent", value);
                      }}
                    />
                    <SettingMessage
                      pending_charge_message={pending_charge_message}
                      pending_charge_message={pending_charge_message}
                      ui_booking_intro={ui_booking_intro}
                      ui_booking_hh_intro={ui_booking_hh_intro}
                      t_and_c_on_check_out={t_and_c_on_check_out}
                      cancellation_policy={cancellation_policy}
                      no_show_cancel_fee_unlimited_msg={no_show_cancel_fee_unlimited_msg}
                      cancel_fee_unlimited_msg={cancel_fee_unlimited_msg}
                      no_show_fee_msg={no_show_fee_msg}
                      handleChangeValue={handleChangeValue}
                    />
                    <FormGroup>
                      <Col sm={12}>
                        <SettingHoliday
                          holidays={holidays}
                          handleAddHoliday={::this.handleAddHoliday}
                          optionRenderer={::this.boatClassRendererFn}
                          handleRemoveHoliday={::this.handleRemoveHoliday}
                        />
                      </Col>
                    </FormGroup>

                    <Col md={12}>
                      <h4 className="section-form-title">Default Boat Classes for Paid members</h4>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Boat Classes
                      </Col>
                      <Col sm={9}>
                        <Select
                          multi={true}
                          name="boat-class-field"
                          value={this.state.paid_boat_classes}
                          labelKey="name"
                          valueKey="id"
                          joinValues={true}
                          options={this.state.boat_classes}
                          optionRenderer={::this.boatClassRendererFn}
                          onChange={::this.handleChangePaidBoatClasses}
                        />
                      </Col>
                    </FormGroup>

                    <Col md={12}>
                      <h4 className="section-form-title">WA Sales Tax</h4>
                    </Col>
                    <SettingFormGroup
                      label="Sale Tax Percent"
                      type="number"
                      value={sale_tax_percent}
                      onChange={value => {
                        handleChangeSetting.call(this, "sale_tax_percent", value);
                      }}
                    />
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Booking Charge
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="booking_charge_sale_tax"
                            checked={this.state.booking_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Fuel Charge
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="fuel_charge_sale_tax"
                            checked={this.state.fuel_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Cleaning Charge
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="cleaning_charge_sale_tax"
                            checked={this.state.cleaning_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Damage Charge
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="damage_charge_sale_tax"
                            checked={this.state.damage_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Auto Fee Charge
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="auto_fee_charge_sale_tax"
                            checked={this.state.auto_fee_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Other booking charges
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="other_charge_sale_tax"
                            checked={this.state.other_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Security Deposit charges
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="security_deposit_charge_sale_tax"
                            checked={this.state.security_deposit_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Sharepass membership charges
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="membership_charge_sale_tax"
                            checked={this.state.membership_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Lesson charges
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="lesson_charge_sale_tax"
                            checked={this.state.lesson_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        E-commerce charges
                      </Col>
                      <Col sm={9}>
                        <label>
                          <Toggle
                            name="e_commerce_charge_sale_tax"
                            checked={this.state.e_commerce_charge_sale_tax}
                            onChange={::this.handleChangeChargeSaleTax}
                          />
                        </label>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12} style={{ marginBottom: 10 }}>
                  <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={this.state.submitDisabled}>
                    Update
                  </Button>
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }

  handleChangeSetting(fieldName, value) {
    let newState = {};
    newState[fieldName] = value;
    this.setState(newState);
  }
}

class SettingFormGroup extends React.Component {
  render() {
    const { handleOnChange, props } = this;
    const { label, type, value } = props;
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl {...props} onChange={handleOnChange.bind(this)} />
        </Col>
      </FormGroup>
    );
  }
  handleOnChange(e) {
    this.props.onChange(e.target.value);
  }
}
