import React from "react";
import ReactDOM from "react-dom";

import util from "../../common/util";
import { URL_CONFIG, CONSTANT, MESSAGES } from "../../common/config";

export default class EditableChargeDiscountField extends React.Component {
  componentDidMount() {
    this.renderEditdableField();
  }

  componentDidUpdate() {
    this.renderEditdableField();
  }

  renderEditdableField() {
    let isAmount = this.props.discount_type == "amount";

    $.fn.editableform.buttons =
      '<button type="submit" class="editable-submit btn-outlined btn btn-primary">ok</button>' +
      '<button type="button" class="editable-cancel btn-outlined btn btn-default">cancel</button>';

    let editableFieldEl = $(ReactDOM.findDOMNode(this.editableField));
    let { amount } = this.props;
    let { pk } = this.props;
    editableFieldEl.editable({
      type: "text",
      pk: pk,
      title: isAmount ? "Enter discount amount" : "Enter discount percent",
      value: amount,
      display: function(value) {
        isAmount ? $(this).text(util.currencyFormatter().format(value)) : $(this).text(value + "%");
      },
      url: isAmount
        ? `/${URL_CONFIG.charges_path}/${pk}/update_discount_percent?type=amount`
        : `/${URL_CONFIG.charges_path}/${pk}/update_discount_percent`,
      ajaxOptions: {
        dataType: "json" //assuming json response
      },
      success: (data, config) => {
        this.props.requestCharges();
      }
    });
    editableFieldEl.editable("setValue", amount);
  }

  render() {
    return <a href="#" ref={c => (this.editableField = c)} />;
  }
}
