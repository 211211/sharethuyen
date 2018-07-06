import React from "react";
import { Async } from "react-select";

import { FormGroup, Col, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config.js";

export default class SelectUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user || {},
      users: [],
      isDisabled: false,
      init: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.user !== "undefined") {
      this.setState({
        user: nextProps.user
      });
    }
    this.initSelectData(nextProps);
  }

  componentDidMount() {
    this.initSelectData(this.props);
  }

  initSelectData(props) {
    let { current_user } = props;
    if (current_user) {
      let newState = this.state;
      newState.users = [current_user];
      newState.user = current_user;
      newState.isDisabled = true;
      this.setState(newState);
    }
    this.setState({
      init: true
    });
  }

  optionRendererFn(option) {
    return (
      <p className="select-item">
        {option.full_name}
        <br />
        <em>{option.email}</em>
      </p>
    );
  }

  render() {
    const { _getOptions, state } = this;
    const { isDisabled } = state;

    // Only set undefined then the placeholder of select component will shown
    const user = state.user && state.user.id ? state.user : undefined;
    return (
      <Async
        name="user-field"
        loadOptions={_getOptions.bind(this)}
        filterOption={() => {
          // Since filter perform on server already!
          // donot perform filtering on client side
          return true;
        }}
        value={user}
        placeholder="Type name or email to search..."
        labelKey="email"
        valueKey="id"
        clearable={true}
        deleteRemoves={false}
        disabled={isDisabled}
        optionRenderer={::this.optionRendererFn}
        onChange={::this.props.onChangeUser}
      />
    );
  }

  _getOptions(input, callback) {
    const { isDisabled, init } = this.state;
    if (!init || isDisabled) {
      // input disable mode, donot fetch data
      callback(null, {
        options: [],
        complete: true
      });
      return;
    }
    let search_path = URL_CONFIG.search_users_path;
    if (this.props.search_url) {
      search_path = this.props.search_url;
    }
    $.getJSON(`${search_path}?q=${input}`).then(
      res => {
        callback(null, {
          options: res,
          // CAREFUL! Only set this to true when there are no more options,
          // or more specific queries will not be sent to the server.
          complete: false
        });
      },
      () => {
        callback(null, {
          options: [],
          complete: false
        });
      }
    );
  }
}
