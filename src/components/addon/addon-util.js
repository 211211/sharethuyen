class AddonUtil {
  static buildSubmitAddon(addon) {
    var submitAddon = $.extend({}, addon);
    return {
      addon: submitAddon
    };
  }
}

export default AddonUtil;
