import React from "react";

import { Row, Col, Grid } from "@sketchpixy/rubix";
import { inject, observer } from "mobx-react/index";

@inject("store")
@observer
export default class Footer extends React.Component {
  state = {
    version: 0
  };

  componentDidMount() {
    this.setState({
      version: document.body.getAttribute("data-version")
    });
  }

  render() {
    let settings = this.props.store.settings;
    var year = new Date().getFullYear();
    return (
      <div id="footer-container">
        <Grid id="footer" className="text-center">
          {(() => {
            if (this.props.is_user) {
              return (
                <Row className="footer-links">
                  <Col xs={12}>
                    <ul>
                      <li>
                        <a href={`${settings.website_url}/tc`} target="_blank">
                          T&C
                        </a>
                      </li>
                      <li>
                        <a href={`${settings.website_url}/privacy-policy/`} target="_blank">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href={`${settings.website_url}/contact/`} target="_blank">
                          Contact
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              );
            }
          })()}
          <Row>
            <Col xs={12}>
              <div>
                © {year} {settings.site_name}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
