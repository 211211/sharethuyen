import moment from "moment";

import { URL_CONFIG, CONSTANT } from "../../common/config";

class BookingChecklistUtil {
  static buildSubmitChecklist(checklist) {
    var formData = new FormData();
    formData.append("booking_checklist_category[name]", checklist.name);

    let { line_items } = checklist;
    if (typeof line_items != "undefined" && line_items.length > 0) {
      line_items.map((line_item, index) => {
        if (line_item.id) {
          formData.append(`booking_checklist_category[line_items_attributes][${index}][id]`, line_item.id);
        }
        formData.append(`booking_checklist_category[line_items_attributes][${index}][name]`, line_item.name);
        if (line_item._destroy) {
          formData.append(`booking_checklist_category[line_items_attributes][${index}][_destroy]`, line_item._destroy);
        }
      });
    }
    return formData;
  }
}

export default BookingChecklistUtil;
