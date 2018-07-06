import React from "react";
import ReactDOM from "react-dom";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  Image,
  PanelFooter,
  FormControl,
  Icon,
  Table,
  ControlLabel
} from "@sketchpixy/rubix";

export default class BookingPhotoListUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitDisabled: false
    };
  }

  componentDidMount() {
    $("#fileInputContainer").append('<input type="file" name="booking_image[image]"/>');
    $("#fileupload").fileupload({
      autoUpload: true,
      uploadTemplateId: null,
      downloadTemplateId: null,
      uploadTemplate: this.uploadTemplate,
      downloadTemplate: this.downloadTemplate
    });
    this.initLightBox();
  }

  componentWillReceiveProps(nextProps) {
    //Only init the grid once, then
    //let the jquery UI uploader handle the grid
    if (this.props.images.files.length == 0 && nextProps.images.files.length > 0) {
      let uploadImages = nextProps.images;

      $("#fileupload")
        .fileupload("option", "done")
        .call("#fileupload", $.Event("done"), { result: uploadImages });
    }
  }

  uploadTemplate(o) {
    var rows = $();
    $.each(o.files, function(index, file) {
      var row = $(
        '<tr class="template-upload fade">' +
          '<td><span class="preview"></span></td>' +
          '<td><p class="name"></p>' +
          '<div class="error"></div>' +
          "</td>" +
          '<td><p class="size"></p>' +
          '<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
          '<div class="progress-bar progress-bar-success" style="width:0;"></div>' +
          "</div>" +
          "</td>" +
          '<td class="col-lg-2 col-sm-1">' +
          (!index && !o.options.autoUpload ? '<button class="start" disabled>Start</button>' : "") +
          (!index
            ? '<button class="btn btn-warning cancel"><i class="glyphicon glyphicon-ban-circle"></i><span>Cancel</span></button>'
            : "") +
          "</td>" +
          "</tr>"
      );
      row.find(".name").text(file.name);
      row.find(".size").text(o.formatFileSize(file.size));
      if (file.error) {
        row.find(".error").text(file.error);
      }
      rows = rows.add(row);
    });
    return rows;
  }

  downloadTemplate(o) {
    var rows = $();
    $.each(o.files, function(index, file) {
      var row = $(
        '<tr class="template-download fade">' +
          '<td><span class="preview"></span></td>' +
          '<td><p class="name"></p>' +
          (file.error ? '<div><span class="error label label-danger"></span></div>' : "") +
          "</td>" +
          '<td><span class="size"></span></td>' +
          '<td class="col-lg-2 col-sm-1"><button class="btn btn-danger delete"><i class="glyphicon glyphicon-trash"></i><span>Delete</span></button>' +
          '<input type="checkbox" name="delete" value="1" class="toggle"></td>' +
          "</tr>"
      );
      row.find(".size").text(o.formatFileSize(file.size));
      if (file.error) {
        row.find(".name").text(file.name);
        row.find(".error").text(file.error);
      } else {
        row.find(".name").text(file.name);
        if (file.thumbnail_url) {
          row.find(".preview").append($("<a></a>").append($("<img>").prop("src", file.thumbnail_url)));
        }
        row
          .find("a")
          .attr("data-gallery", "")
          .prop("href", file.url);
        row
          .find("button.delete")
          .attr("data-type", file.delete_type)
          .attr("data-url", file.delete_url);
      }
      rows = rows.add(row);
    });
    return rows;
  }

  initLightBox() {
    $("#uploadedFilesContainer").on("click", "a", function(event) {
      event = event || window.event;
      var link = $(this).get(0),
        options = { index: link, event: event, toggleControlsOnReturn: false, toggleControlsOnSlideClick: false },
        links = $("#uploadedFilesContainer .preview a");
      blueimp.Gallery(links, options);
    });
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  render() {
    let action_url = `/admin/bookings/${this.props.booking.id}/booking_images`;
    return (
      <Row>
        <Col md={12}>
          <form id="fileupload" action={action_url} method="POST">
            <div className="row fileupload-buttonbar">
              <div className="col-lg-7">
                <span id="fileInputContainer" className="btn btn-success fileinput-button">
                  <i className="glyphicon glyphicon-plus" />
                  <span>Add file...</span>
                </span>
                <button type="reset" className="btn btn-warning cancel">
                  <i className="glyphicon glyphicon-ban-circle" />
                  <span>Cancel upload</span>
                </button>
                <button type="button" className="btn btn-danger delete">
                  <i className="glyphicon glyphicon-trash" />
                  <span>Delete</span>
                </button>
                <input type="checkbox" className="toggle" />
                <span className="fileupload-process" />
              </div>
              <div className="col-lg-5 fileupload-progress fade">
                <div
                  className="progress progress-striped active"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div className="progress-bar progress-bar-success" style={{ width: 0 }} />
                </div>
                <div className="progress-extended">&nbsp;</div>
              </div>
            </div>
            <table role="presentation" className="table table-striped">
              <tbody className="files" id="uploadedFilesContainer" />
            </table>
            <input type="hidden" name="booking_image[photo_type]" value={this.props.type} />
          </form>
        </Col>
      </Row>
    );
  }
}
