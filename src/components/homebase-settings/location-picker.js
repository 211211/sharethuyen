import React, { Component } from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { API_KEY } from "../../common/config";

class LocationPicker extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      location: {
        lat: location.latitude,
        lng: location.longitude
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location) {
      this.setState({
        location: {
          lat: nextProps.location.latitude,
          lng: nextProps.location.longitude
        }
      });
    }
  }

  onClick = event => {
    const { onTick } = this.props;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const location = {
      lat,
      lng
    };
    this.setState({
      location
    });
    onTick && onTick(location);
  };

  render() {
    const { location } = this.state;
    return (
      <GoogleMap defaultZoom={8} onClick={this.onClick} center={location}>
        {location && <Marker position={location} />}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      API_KEY.google_map +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(LocationPicker);
