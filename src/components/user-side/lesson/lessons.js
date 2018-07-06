import React from "react";

import { PanelContainer, Panel, PanelBody, Grid, Row, Col, Image } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../../common/config";
import client from "../../../common/http-client";
import UserSideHeader from "../_core/user-side-header";
import Util from "../../../common/util";

import { withRouter, Link } from "react-router";

@withRouter
export default class UserSideLessons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lessons: [] };
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.user_lessons_path}`).then(res => {
      this.setState({
        lessons: res
      });
    });
  }

  render() {
    return (
      <div className="user-side">
        <UserSideHeader />
        <PanelContainer noOverflow controls={false}>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col xs={12} className="text-center section-header">
                    <h2 className="bshare-primary-color page-title">BOATING LESSONS FOR ALL SKILL LEVELS</h2>
                    <p>
                      We welcome new boaters, and love showing you the ropes. (Well, on a boat they are called ‘lines’,
                      but we will get to that later.)
                    </p>
                    <p>We have instructors on staff and small boats that are super easy to drive.</p>
                    <p>
                      We can help you with a progression that will take you from your first time on the dock to weekends
                      in the islands and beyond.
                    </p>
                    <p>
                      Already familiar with boating, but want to improve your skills and expand your endorsements? We
                      can help with that too.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <ul className="lessons">
                      {this.state.lessons.map(lesson => {
                        return (
                          <li key={lesson.id} className="lesson">
                            <h4>{lesson.name}</h4>
                            <p>{lesson.description}</p>
                            <span className="price">{Util.currencyFormatter().format(lesson.price)}</span>
                            <Link
                              to={`${URL_CONFIG.user_lessons_path}/${lesson.id}`}
                              className="user-side-btn btn btn-lg btn-primary"
                            >
                              Book now
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
