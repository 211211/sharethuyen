import React from "react";
import Select from "react-select";

export default class SelectBoatClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boat_class: {},
      boat_classes: []
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.boat_class = nextProps.boat_class;
    newState.boat_classes = this.addAllOption(nextProps.boat_classes);
    this.setState(newState);
  }

  addAllOption(boat_classes) {
    if (boat_classes && boat_classes[0] && boat_classes[0].id != -1 && this.props.showAllOption) {
      boat_classes.unshift({
        id: -1,
        name: "VIEW ALL",
        color_hex: "#fff"
      });
    }
    return boat_classes;
  }

  boatClassRendererFn(option) {
    return (
      <p className="boat-class-select-item">
        <span className="color-swatch-select" style={{ backgroundColor: option.color_hex }} />
        {option.name}
      </p>
    );
  }

  render() {
    return (
      <Select
        name="boat-class-field"
        value={this.state.boat_class}
        labelKey="name"
        valueKey="id"
        options={this.state.boat_classes}
        optionRenderer={::this.boatClassRendererFn}
        onChange={::this.props.onChangeBoatClass}
      />
    );
  }
}
