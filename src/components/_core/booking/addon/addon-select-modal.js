import React from "react";
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
import { isInteger } from "lodash";
import Loader from "react-loader";

import { URL_CONFIG, CONSTANT } from "../../../../common/config";
import client from "../../../../common/http-client";
import Util from "../../../../common/util";

export default class AddonSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addons: [],
      selectedAddons: [],
      loaded: false,
      total: 0
    };
    this.onToggleAddon = this.onToggleAddon.bind(this);
  }

  setLoaded(loaded) {
    this.setState({
      loaded: loaded
    });
  }

  close() {
    this.resetForm();
    this.setState({
      showModal: false
    });
  }

  open() {
    this.setState({
      showModal: true,
      loaded: false
    });
    const { booking } = this.props;
    client
      .get(`${URL_CONFIG.get_addon_available_for_adding_path}`, {
        start_date: booking.start_date.format(CONSTANT.DATE_FORMAT),
        end_date: booking.end_date.format(CONSTANT.DATE_FORMAT)
      })
      .then(
        res => {
          this.setState({
            addons: res,
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
    const submitAddons = this.buildSubmitAddons();
    this.props.resolvedFn(submitAddons);
  }

  resetForm() {
    const { addons } = this.state;
    const newState = { selectedAddons: [] };
    addons.forEach(addon => {
      newState[`quantity${addon.id}`] = 0;
    });
    this.setState(newState);
  }

  buildSubmitAddons() {
    const { selectedAddons } = this.state;
    const submitAddons = selectedAddons.map(addon => {
      return {
        addon_id: addon.id,
        ...addon,
        quantity: this.state[`quantity${addon.id}`]
      };
    });
    return submitAddons;
  }

  onToggleAddon(addon) {
    const { selectedAddons } = this.state;
    const existAddon = selectedAddons.find(element => element.id === addon.id);
    let newSelectedAddons = existAddon
      ? selectedAddons.filter(element => element.id !== addon.id)
      : [...selectedAddons, addon];
    this.setState(
      {
        selectedAddons: newSelectedAddons
      },
      () => {
        this.updateTotal();
      }
    );
  }

  handleQuantityChange(e) {
    const { target } = e;
    this.setState(
      {
        [target.name]: target.value
      },
      () => {
        this.updateTotal();
      }
    );
  }

  validQuantityAddons(selectedAddons) {
    for (let index = 0; index < selectedAddons.length; index++) {
      const quantity = this.state[`quantity${selectedAddons[index].id}`];
      if (!quantity || quantity > selectedAddons[index].remaining || quantity <= 0) return false;
    }
    return true;
  }

  updateTotal() {
    const { selectedAddons } = this.state;
    let total = 0;
    const { booking } = this.props;
    const numOfDate = booking.end_date.diff(booking.start_date, "days") + 1;
    selectedAddons.forEach(addon => {
      const quantityInStr = this.state[`quantity${addon.id}`];
      const quantity = isInteger(parseInt(quantityInStr)) ? parseInt(quantityInStr) : 0;
      if (addon.price_strategy === "per_booking") {
        total += quantity * addon.price;
      } else {
        total += quantity * addon.price * numOfDate;
      }
    });
    this.setState({ total });
  }

  render() {
    const { state, onToggleAddon } = this;
    const { loaded, addons, selectedAddons, total } = state;
    const okDisabled = !loaded || selectedAddons.length == 0 || !this.validQuantityAddons(selectedAddons);

    let addons_tpl =
      addons.length > 0 ? (
        addons.map(addon => {
          const selectedAddon = !!selectedAddons.find(element => element.id == addon.id);
          const { price_strategy, name, price } = addon;
          const addonTitle = `${name} - ${Util.currencyFormatter().format(price)} / ${
            price_strategy == "per_booking" ? "booking" : "date"
          }`;
          return (
            <Checkbox
              key={addon.id}
              className="addon-select-checkbox"
              onChange={() => {
                onToggleAddon(addon);
              }}
            >
              <Media>
                <Media.Body>
                  <p className="addon-name">{addonTitle}</p>
                  <FormGroup>
                    <Col md={3}>Remaining:</Col>
                    <Col md={9}>{addon.remaining} </Col>
                  </FormGroup>
                  {selectedAddon && (
                    <FormGroup>
                      <Col md={3}>Quantity:</Col>
                      <Col md={9}>
                        <FormControl
                          value={this.state[`quantity${addon.id}`]}
                          type="number"
                          placeholder="Quantity"
                          autoFocus
                          onChange={::this.handleQuantityChange}
                          name={`quantity${addon.id}`}
                        />
                      </Col>
                    </FormGroup>
                  )}
                </Media.Body>
              </Media>
            </Checkbox>
          );
        })
      ) : (
        <div>There is no addons available to assign</div>
      );

    return (
      <Modal className="add-ons-modal" show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose Add-ons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={loaded} />
          <Row className="form-horizontal addons-list">
            <Col md={12} className={loaded ? "" : "is-loading"}>
              <FormGroup>
                {(() => {
                  if (loaded) {
                    return <div>{addons_tpl}</div>;
                  } else {
                    return null;
                  }
                })()}
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {total > 0 && <label style={{ marginTop: 0 }}>Total: {Util.currencyFormatter().format(total)}</label>}
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
}
