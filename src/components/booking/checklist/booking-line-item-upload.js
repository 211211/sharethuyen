import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";

import { Col, Radio } from "@sketchpixy/rubix";

import Loader from "react-loader";

export default class BookingLineItemUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line_item: props.line_item,
      loaded: true
    };
  }

  componentDidMount() {
    let _this = this;
    let { line_item } = this.props;

    $("#fileInputContainer-" + line_item.id).append('<input type="file" name="booking_line_item[image]"/>');

    if (_this.props.readonly) {
      $(".fileupload-buttonbar").hide();
    }

    $("#fileupload-" + line_item.id).fileupload({
      autoUpload: true,
      start: function(e) {
        _this.setState({
          loaded: false
        });
      },
      done: function(e, data) {
        _this.setState({
          loaded: true
        });
        $("#uploadedFilesContainer-" + line_item.id).html("");
        $.each(data.result.files, function(index, file) {
          var row = $(
            '<tr class="template-download">' +
              '<td><p class="name"></p>' +
              (file.error ? '<div><span class="error label label-danger"></span></div>' : "") +
              "</td>" +
              '<td class="col-lg-2 col-sm-1"><button class="btn btn-danger delete"><i class="glyphicon glyphicon-trash"></i></button>' +
              "</td>" +
              "</tr>"
          );
          if (file.error) {
            row.find(".name").text(file.name);
            row.find(".error").text(file.error);
          } else {
            if (file.thumbnail_url) {
              row.find(".name").append($("<a></a>").append("View"));
            }
            row
              .find("a")
              .attr("data-gallery", "")
              .prop("href", file.url);
            if (!_this.props.readonly) {
              row
                .find("button.delete")
                .attr("data-type", file.delete_type)
                .attr("data-url", file.delete_url);
            } else {
              row.find("button.delete").hide();
            }
          }
          $(row).appendTo($("#uploadedFilesContainer-" + line_item.id));
        });
      }
    });

    let { booking_line_item } = this.props;
    if (booking_line_item && booking_line_item.url) {
      let uploadImages = { files: [booking_line_item] };

      $("#fileupload-" + line_item.id)
        .fileupload("option", "done")
        .call("#fileupload-" + line_item.id, $.Event("done"), { result: uploadImages });
    }
    this.initLightBox();
  }

  initLightBox() {
    let { line_item } = this.props;
    $("#uploadedFilesContainer-" + line_item.id).on("click", "a", function(event) {
      event = event || window.event;
      var link = $(this).get(0),
        options = { index: link, event: event, toggleControlsOnReturn: false, toggleControlsOnSlideClick: false },
        links = $("#uploadedFilesContainer-" + line_item.id + " .name a");
      blueimp.Gallery(links, options);
    });
  }

  render() {
    let action_url = `/admin/bookings/${this.props.booking.id}/booking_line_items/upload_image`;
    let { booking } = this.props;
    let { line_item } = this.props;
    let selectFile = this.state.loaded ? (
      <span>
        <i className="glyphicon glyphicon-plus" />
        <span>Add file</span>
      </span>
    ) : (
      ""
    );

    return (
      <form id={"fileupload-" + line_item.id} action={action_url} method="POST">
        <div className="row fileupload-buttonbar">
          <div className="col-lg-7">
            <span id={"fileInputContainer-" + line_item.id} className="btn btn-success fileinput-button">
              {selectFile}
              <Loader loaded={this.state.loaded} position="relative" color="#FFF" scale={0.5} />
            </span>
            <br />
          </div>
        </div>
        <table role="presentation" className="table table-striped">
          <tbody className="files" id={"uploadedFilesContainer-" + line_item.id} />
        </table>
        <input type="hidden" name="booking_line_item[booking_id]" value={booking.id} />
        <input type="hidden" name="booking_line_item[booking_checklist_line_item_id]" value={line_item.id} />
      </form>
    );
  }
}
