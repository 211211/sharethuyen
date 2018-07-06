import React from "react";
import Loader from "react-loader";
import { Link, withRouter } from "react-router";
import {
  Button,
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelContainer,
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Icon
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import UserBookingNotes from "./user-booking-notes";
import Util from "../../common/util";
import ModalConfirm from "../_core/modal-confirm";

@withRouter
export default class UserNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      user_notes: [],
      new_user_notes: "",
      note_adding: false,
      note_loading: false
    };

    this.onChangeUserNotes = this.onChangeUserNotes.bind(this);
    this.onAddAdminNotes = this.onAddAdminNotes.bind(this);
    this.onClickRemoveNote = this.onClickRemoveNote.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.params;
    client.get(`${URL_CONFIG.users_path}/${id}`).then(user => {
      this.setState({ user });
    });
    this.loadUserNotes();
  }

  render() {
    const { user, loading, new_user_notes, user_notes, note_adding, note_loading } = this.state;
    const { id } = this.props.params;
    const { onChangeUserNotes, onAddAdminNotes, onClickRemoveNote } = this;
    return (
      <div className="bs-user-notes">
        <UserBookingNotes user={user} />
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Row className="panel-header">
                  <Col md={12}>
                    <Col md={6}>{user.full_name && <h4>{user.full_name}'s Notes</h4>}</Col>
                  </Col>
                </Row>
                <Form horizontal>
                  {note_loading && <Loader scale={0.5} position="relative" />}
                  {user_notes.length > 0 && (
                    <Row>
                      <Col sm={3} componentClass={ControlLabel}>
                        Added Note(s)
                      </Col>
                      <Col sm={9}>
                        {user_notes.map((user_note, index) => {
                          return (
                            <div index={index} className="added-note-item">
                              <p>{user_note.notes}</p>
                              <span className="added-time">
                                Added on {moment(user_note.created_at).format(CONSTANT.DATE_TIME_FORMAT_DISPLAY)}
                              </span>
                              <Button
                                outlined
                                bsStyle="danger"
                                className="fav-btn remove-btn"
                                onClick={() => {
                                  this.onClickRemoveNote(index);
                                }}
                              >
                                <Icon glyph="icon-simple-line-icons-close" />
                              </Button>
                            </div>
                          );
                        })}
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      New Note
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass="textarea"
                        rows="3"
                        value={new_user_notes}
                        onChange={onChangeUserNotes}
                        maxLength={500}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={9} smOffset={3}>
                      <Button
                        outlined
                        type="submit"
                        bsStyle="blue"
                        disabled={note_adding}
                        onClick={onAddAdminNotes}
                        style={{ marginTop: 5 }}
                      >
                        Add
                      </Button>
                      {note_adding && <Loader scale={0.5} position="relative" />}
                    </Col>
                  </Row>
                </Form>
              </Grid>
            </PanelBody>
          </Panel>
          <ModalConfirm
            message="Do you want to remove this Note?"
            ref={c => (this.confirmDeleteModal = c)}
            resolvedFn={::this.removeNote}
          />
        </PanelContainer>
      </div>
    );
  }

  loadUserNotes() {
    const { id } = this.props.params;

    this.setState({
      note_loading: true
    });
    client.get(`${URL_CONFIG.user_notes_path}?user_id=${id}`).then(
      user_notes => {
        this.setState({ user_notes });
        this.setState({
          note_loading: false
        });
      },
      () => {
        this.setState({
          note_loading: false
        });
      }
    );
  }

  onChangeUserNotes(e) {
    this.setState({
      new_user_notes: e.target.value
    });
  }

  onAddAdminNotes(e) {
    e.preventDefault();
    const { id } = this.props.params;
    const { user, new_user_notes, user_notes } = this.state;
    this.setState({
      note_adding: true
    });
    client
      .post(`${URL_CONFIG.user_notes_path}`, {
        user_note: {
          user_id: user.id,
          notes: new_user_notes
        }
      })
      .then(user_note => {
        Util.growl("update_admin_note_for_user_successfully");
        this.setState({
          user_notes: user_notes.concat(user_note),
          note_adding: false,
          new_user_notes: ""
        });
      });
  }

  onClickRemoveNote(index) {
    this.noteIndex = index;
    this.confirmDeleteModal.open();
  }

  removeNote() {
    const { user_notes } = this.state;
    const toBeDeletedNote = user_notes[this.noteIndex];
    this.confirmDeleteModal.setLoading(true);
    client.delete(`${URL_CONFIG.user_notes_path}/${toBeDeletedNote.id}`).then(
      () => {
        user_notes.splice(this.noteIndex, 1);
        this.setState({ user_notes });
        this.confirmDeleteModal.setLoading(false);
        this.confirmDeleteModal.close();
        Util.growl("remove_admin_note_for_user_successfully");
      },
      () => {
        this.confirmDeleteModal.setLoading(false);
      }
    );
  }
}
