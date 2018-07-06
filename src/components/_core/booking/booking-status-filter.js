import React from "react";

import { FormControl } from "@sketchpixy/rubix";
import enhanceWithClickOutside from "react-click-outside";

class BookingStatusFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowOptions: false
    };
  }

  handleClickOutside() {
    this.setState({ isShowOptions: false });
  }

  render() {
    const statuses = ["tba", "confirmed", "in_use", "processing", "checked_in", "completed", "cancelled", "no_show"];
    const { _onChangeStatus, _toggleOptions, state } = this;
    const { filteredStatuses } = this.props;
    const { isShowOptions } = state;
    return (
      <span className="bs-booking-status-filter">
        <span className="filter-select" onClick={_toggleOptions.bind(this)}>
          <span>Status Filter</span>
          <span className="icon-fontello-sort-down rubix-icon" />
        </span>
        {isShowOptions && (
          <ul className="filter-options">
            {statuses.map((status, index) => {
              return (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filteredStatuses.indexOf(status) !== -1}
                      name={status}
                      onChange={_onChangeStatus.bind(this)}
                    />{" "}
                    {status}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </span>
    );
  }

  _onChangeStatus(event) {
    const { checked, name } = event.target;
    if (checked) {
      this.props.addFilterStatus(name);
    } else {
      this.props.removeFilterStatus(name);
    }
  }

  _toggleOptions() {
    const isShowOptions = !this.state.isShowOptions;
    this.setState({ isShowOptions });
  }
}

export default enhanceWithClickOutside(BookingStatusFilter);
