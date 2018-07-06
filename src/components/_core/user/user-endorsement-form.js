import React from "react";
import ReactDOM from "react-dom";

import { Form } from "@sketchpixy/rubix";

export default class UserEndorsementForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initForm(nextProps);
  }

  resetEndorsementFormValue(endorsementEditorEl) {
    endorsementEditorEl.find("input:text, input:password, input:file, select, textarea").val("");
    endorsementEditorEl
      .find("input:radio, input:checkbox")
      .removeAttr("checked")
      .removeAttr("selected");
  }

  initForm(props) {
    let { user } = props;
    if (!user.endorsement_check_list || user.endorsement_check_list.length == 0) {
      return;
    }
    var formRenderOpts = {
      formData: user.endorsement_check_list,
      dataType: "json"
    };
    var endorsementEditorEl = $(ReactDOM.findDOMNode(this.endorsementEditor));
    endorsementEditorEl.formRender(formRenderOpts);
    this.resetEndorsementFormValue(endorsementEditorEl);

    let valueObj = {};
    if (user.endorsement) {
      valueObj = JSON.parse(user.endorsement);
    }
    this.mappingValue(valueObj);
  }

  mappingValue(valueObj) {
    //Sample ValueObj
    // var valueObj = {
    //   "checkbox-1480873924900":"on",
    //   "radio-group-1480986411457":"option-1",
    //   "text-1480936035516":"Demo text value",
    //   "checkbox-group-1480873923199[]":["option-1","option-2"]
    // }

    Object.keys(valueObj).forEach(elementName => {
      let element = $(".endorsement-form [name='" + elementName + "']");
      if (elementName.startsWith("checkbox-group")) {
        if (typeof valueObj[elementName] == "string") {
          let selectedValue = valueObj[elementName];
          //This is only one checkbox got selected
          element.each((index, option) => {
            if (option.value == selectedValue) {
              $(option).prop("checked", true);
            }
          });
        } else {
          //It should be array
          valueObj[elementName].forEach(selectedValue => {
            element.each((index, option) => {
              if (option.value == selectedValue) {
                $(option).prop("checked", true);
              }
            });
          });
        }
      } else if (elementName.startsWith("radio-group")) {
        let selectedValue = valueObj[elementName];
        element.each((index, option) => {
          if (option.value == selectedValue) {
            $(option).prop("checked", true);
          }
        });
      } else if (elementName.startsWith("checkbox")) {
        if (valueObj[elementName] == "on") {
          element.prop("checked", true);
        }
      } else if (elementName.startsWith("text")) {
        if (valueObj[elementName].length > 0) {
          element.val(valueObj[elementName]);
        }
      }
    });
  }

  buildEndorsement() {
    var endorsementValue = {};
    var formElements = $(".endorsement-form :input").serializeArray();
    formElements.forEach(formElement => {
      if (endorsementValue[formElement.name] !== undefined) {
        if (!endorsementValue[formElement.name].push) {
          endorsementValue[formElement.name] = [endorsementValue[formElement.name]];
        }
        endorsementValue[formElement.name].push(formElement.value || "");
      } else {
        endorsementValue[formElement.name] = formElement.value || "";
      }
    });
    return JSON.stringify(endorsementValue);
  }

  render() {
    return (
      <Form className="endorsement-form">
        <fieldset disabled={this.props.readonly}>
          <h4 className="section-form-title">Endorsements</h4>
          <div ref={c => (this.endorsementEditor = c)} />
        </fieldset>
      </Form>
    );
  }
}
