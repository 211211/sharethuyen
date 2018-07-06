class UserUtil {
  static handleFieldChange(field, value) {
    var newState = this.state;

    if (typeof field == "object") {
      newState.user[field.name][field.index][field.field] = value;
    } else {
      newState.user[field] = value;
    }
    this.setState(newState);
  }

  static mapUserState(user) {
    return {
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      secondary_phone: user.secondary_phone || "",
      address: user.address || "",
      email: user.email || "",
      password: user.password || "",
      password_confirmation: user.password_confirmation || "",
      profile_picture_url: user.profile_picture_url || "",
      profile_picture_thumb_url: user.profile_picture_thumb_url || "",
      role: user.role || "",
      balance: user.balance || 0,
      membership_type: user.membership_type || "",
      is_active: typeof user.is_active == "boolean" ? user.is_active : true,
      role_ids: [],
      membership_status: user.membership_status || "",
      membership_charges: user.membership_charges || [],
      billing_addresses: user.billing_addresses || [],
      security_deposit_charge: user.security_deposit_charge || {},
      current_membership_charge: user.current_membership_charge || {},
      current_membership_waitlist: user.current_membership_waitlist || {},
      membership_valid_until: user.membership_valid_until || ""
    };
  }

  static mapUserEndorsementState(user) {
    let user_profile = user.user_profile || {
      wa_state_marine_photo_url: "",
      wa_state_marine_photo_thumb_url: "",
      driver_license_photo_url: "",
      driver_license_photo_thumb_url: "",
      wa_state_marine_field: "",
      driver_license_field: ""
    };

    if (user.user_profile) {
      user_profile.id = user.user_profile.id || "";
      user_profile.wa_state_marine_photo_url = user.user_profile.wa_state_marine_photo_url || "";
      user_profile.wa_state_marine_photo_thumb_url = user.user_profile.wa_state_marine_photo_thumb_url || "";
      user_profile.driver_license_photo_url = user.user_profile.driver_license_photo_url || "";
      user_profile.driver_license_photo_thumb_url = user.user_profile.driver_license_photo_thumb_url || "";
      user_profile.wa_state_marine_field = user.user_profile.wa_state_marine_field || "";
      user_profile.driver_license_field = user.user_profile.driver_license_field || "";
    }

    return {
      id: user.id,
      full_name: user.full_name || "",
      email: user.email || "",
      endorsement_check_list: user.endorsement_check_list || "",
      endorsement: user.endorsement || "",
      boat_class_ids: user.boat_class_ids || [],
      boat_classes: user.boat_classes || [],
      user_profile: user_profile || {
        wa_state_marine_photo_url: "",
        wa_state_marine_photo_thumb_url: "",
        driver_license_photo_url: "",
        driver_license_photo_thumb_url: "",
        wa_state_marine_field: "",
        driver_license_field: ""
      }
    };
  }

  static mapBillingAddressState(billing_address) {
    return {
      id: billing_address.id || "",
      line1: billing_address.line1 || "",
      line2: billing_address.line2 || "",
      city: billing_address.city || "",
      state: billing_address.state || "AL",
      zip: billing_address.zip || "",
      country: billing_address.country || "US"
    };
  }

  static handleFieldChange(state, field, value) {
    var newState = state;

    if (typeof field == "object") {
      newState.user[field.name][field.index][field.field] = value;
    } else {
      if (field.indexOf(".") > 0) {
        let fields = field.split(".");
        newState.user[fields[0]][fields[1]] = value;
      } else {
        newState.user[field] = value;
      }
    }
    return newState;
  }

  static buildSubmitUser(user) {
    var formData = new FormData();
    formData.append("user[id]", user.id);
    formData.append("user[first_name]", user.first_name);
    formData.append("user[last_name]", user.last_name);

    if (user.profile_picture) {
      formData.append("user[profile_picture]", user.profile_picture);
    }
    formData.append("user[phone]", user.phone);
    formData.append("user[secondary_phone]", user.secondary_phone);
    formData.append("user[address]", user.address);
    formData.append("user[email]", user.email);
    formData.append("user[password]", user.password);
    formData.append("user[password_confirmation]", user.password_confirmation);
    formData.append("user[role]", user.role);
    formData.append("user[is_active]", user.is_active);
    formData.append("user[balance]", user.balance);

    if (typeof user.role_ids != "undefined" && user.role_ids.length > 0) {
      user.role_ids.map(id => {
        formData.append("user[role_ids][]", id);
      });
    }

    if (typeof user.billing_addresses != "undefined" && user.billing_addresses.length > 0) {
      user.billing_addresses.map((billing_address, index) => {
        formData.append(`user[billing_addresses_attributes][${index}][id]`, billing_address.id);
        formData.append(`user[billing_addresses_attributes][${index}][line1]`, billing_address.line1);
        formData.append(`user[billing_addresses_attributes][${index}][line2]`, billing_address.line2);
        formData.append(`user[billing_addresses_attributes][${index}][city]`, billing_address.city);
        formData.append(`user[billing_addresses_attributes][${index}][state]`, billing_address.state);
        formData.append(`user[billing_addresses_attributes][${index}][zip]`, billing_address.zip);
        formData.append(`user[billing_addresses_attributes][${index}][country]`, billing_address.country);
        if (billing_address._destroy) {
          formData.append(`user[billing_addresses_attributes][${index}][_destroy]`, billing_address._destroy);
        }
      });
    }
    return formData;
  }

  static buildSubmitUserEndorsement(user) {
    var formData = new FormData();
    formData.append("user[endorsement]", user.endorsement);

    if (user.boat_class_ids.length > 0) {
      user.boat_class_ids.map(id => {
        formData.append("user[boat_class_ids][]", id);
      });
    } else {
      formData.append("user[boat_class_ids][]", "");
    }

    if (user.user_profile) {
      const {
        id,
        driver_license_field,
        driver_license_photo,
        driver_license_photo_url_del,
        wa_state_marine_field,
        wa_state_marine_photo,
        wa_state_marine_photo_url_del
      } = user.user_profile;
      if (id) {
        formData.append("user[user_profile_attributes][id]", id);
      }
      formData.append("user[user_profile_attributes][wa_state_marine_field]", wa_state_marine_field);
      formData.append("user[user_profile_attributes][driver_license_field]", driver_license_field);
      if (driver_license_photo) {
        formData.append("user[user_profile_attributes][driver_license_photo]", driver_license_photo);
      }
      if (wa_state_marine_photo) {
        formData.append("user[user_profile_attributes][wa_state_marine_photo]", wa_state_marine_photo);
      }
      if (driver_license_photo_url_del) {
        formData.append("meta[driver_license_photo_url_del]", true);
      }
      if (wa_state_marine_photo_url_del) {
        formData.append("meta[wa_state_marine_photo_url_del]", true);
      }
    }
    return formData;
  }
}

export default UserUtil;
