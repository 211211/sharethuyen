import React from "react";
import reactCSS from "reactcss";
import { withRouter, Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES } from "../../../common/config";
import util from "../../../common/util";

@withRouter
@inject("store")
@observer
export default class UserSideHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.store.user;
    const settings = this.props.store.settings;

    const styles = reactCSS({
      default: {
        contactButton: {
          backgroundImage: `url(${IMAGES.contact_icon})`,
          backgroundSize: 50,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 25px top 7px"
        }
      }
    });
    return (
      <PanelContainer controls={false} className="contact-user-balance">
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col xs={12} sm={6} className="nav-links">
                  <a
                    href={`${settings.website_url}/contact/`}
                    className="user-side-btn contact-btn btn btn-lg btn-primary"
                    target="_blank"
                    style={styles.contactButton}
                  >
                    Contact Us
                  </a>
                  <Link
                    to={`${URL_CONFIG.user_lessons_path}`}
                    className="user-side-btn btn btn-lg btn-primary book-a-lesson"
                  >
                    Book a Lesson
                  </Link>
                </Col>
                <Col xs={12} sm={6} className="user-balance">
                  <Button outlined bsStyle="success" className="user-side-btn" lg disabled>
                    Account Balance: {util.currencyFormatter().format(user.balance)}
                  </Button>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
