import React from "react";
import { withRouter } from "react-router";

import {
  Row,
  Col,
  Icon,
  Grid,
  Panel,
  Image,
  Table,
  Button,
  PanelHeader,
  PanelBody,
  PanelFooter,
  PanelContainer
} from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";
import ModalConfirm from "../_core/modal-confirm";

@withRouter
export default class BoatCard extends React.Component {
  editBoat() {
    let { boats_path } = URL_CONFIG;
    this.props.router.push(`${boats_path}/${this.props.boat.id}/edit`);
  }

  goToBoatBooking() {
    let { boats_path } = URL_CONFIG;
    this.props.router.push(`${boats_path}/${this.props.boat.id}/booking`);
  }

  removeFn() {
    this.confirmDeleteModal.setLoading(true);
    let { boat } = this.props;
    client.delete(`${URL_CONFIG.boats_path}/${boat.id}`).then(
      () => {
        this.confirmDeleteModal.close();
        this.props.parent.onRemoveBoat(boat);
      },
      () => {
        this.confirmDeleteModal.setLoading(false);
      }
    );
  }

  openConfirmModal() {
    this.confirmDeleteModal.open();
  }

  render() {
    const { boat } = this.props;
    const { fuel_remain } = boat;

    // TODO: Should reused from config file, already configured on another branch,
    // wait to merge first
    const MAX_FUEL_SIZE = 16;

    var image;
    if (boat.primary_image) {
      image = boat.primary_image;
    } else {
      image = "imgs/app/boat.jpeg";
    }

    return (
      <PanelContainer className="bs-boat-card border-hover-green">
        <Panel>
          <PanelHeader>
            <Grid>
              <Row>
                <Col xs={12}>
                  <h4>
                    {boat.name} - {boat.status}{" "}
                  </h4>
                  <div className="bs-fuel-indicator">
                    {Array.from(Array(MAX_FUEL_SIZE).keys()).map(index => {
                      if (index + 1 <= fuel_remain) {
                        return <span key={index} className="fuel-bar active" />;
                      } else {
                        return <span key={index} className="fuel-bar" />;
                      }
                    })}
                  </div>
                  <h6>{boat.year}</h6>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody className="panel-body">
            <Grid>
              <Row>
                <Col xs={12}>
                  <Image responsive src={image} width="200" height="150" />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
          <PanelFooter>
            <Grid>
              <Row>
                <div className="text-center footer-btn-group">
                  <Button bsStyle="green" className="remove-sm" onlyOnHover onClick={::this.editBoat}>
                    Edit
                  </Button>{" "}
                  <Button bsStyle="green" className="remove-sm" onlyOnHover onClick={::this.goToBoatBooking}>
                    Bookings
                  </Button>{" "}
                  <Button bsStyle="red" onClick={::this.openConfirmModal}>
                    Remove
                  </Button>
                </div>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
        <ModalConfirm
          message="Do you want to remove this Boat?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
      </PanelContainer>
    );
  }
}
