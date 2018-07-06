const URL_CONFIG = {
  admin_dashboard_path: "admin/dashboard",
  admin_dashboard_flag_data_path: "admin/dashboard/flag_data",
  login_path: "login",
  register_path: "register",
  passwords_path: "passwords",
  logout_path: "logout",

  boats_path: "admin/boats",
  boats_path_json: "admin/boats.json",
  get_boat_available_for_assigning_path: "admin/boats/boat_available_for_assigning",
  boats_booking_calendar_path: "admin/boats/booking_calendar",
  boat_fuel_logs_path: "admin/boat_fuel_logs",
  boat_fuel_logs_fill_up_path: "admin/boat_fuel_logs/fill_up",
  boat_fuel_logs_edit_fuel_path: "admin/boat_fuel_logs/edit_fuel",
  boat_fuel_logs_change_meter_path: "admin/boat_fuel_logs/change_meter",

  boat_classes_path: "admin/boat_classes",
  boat_classes_path_json: "admin/boat_classes.json",
  admin_boat_classes_search_path: "admin/boat_classes/search",

  users_path: "admin/users",
  user_notes_path: "admin/user_notes",
  users_path_json: "admin/users.json",
  search_users_path: "admin/users/search",
  search_users_not_belong_group_path: "admin/users/search_not_belong_group",

  groups_path: "admin/groups",
  membership_waitlists_path: "admin/membership_waitlists",

  admin_roles_path: "admin/roles",
  boat_amenities_path: "admin/boat_amenities",
  search_boat_amenities_path: "admin/boat_amenities/search",

  lessons_path: "admin/lessons",
  search_lessons_path: "admin/lessons/search",

  bookings_path: "admin/bookings",
  bookings_red_flags_path: "admin/bookings/bookings_red_flags",
  booking_checklist_categories_path: "admin/booking_checklist_categories",
  search_booking_checklist_categories_path: "admin/booking_checklist_categories/search",
  booking_not_assign_path: "admin/bookings/booking_not_assign",

  charges_path: "admin/charges",
  transactions_path: "admin/transactions",

  settings_path: "admin/settings",
  update_batch_settings_path: "admin/settings/update_batch",
  update_batch_membership_waitlist_settings_path: "admin/settings/update_batch_membership_waitlist",
  update_branding_settings_path: "admin/settings/update_branding_settings",
  get_value_by_var_path: "admin/settings/get_value_by_var",
  update_value_by_var_path: "admin/settings/update_value_by_var",
  find_batch_path: "admin/settings/find_batch",
  seasons_path: "admin/seasons",
  deposit_return_users_path: "admin/seasons/deposit_return_users",
  boat_class_prices: "admin/boat_class_prices",
  boat_class_prices_json: "admin/boat_class_prices.json",
  pricing_settings_path: "admin/pricing_settings",
  admin_users_path: "admin/admin_users",

  //User route
  dashboard_path: "dashboard",
  current_user_path: "current_user",

  profile_user_path: "profile",
  profile_user_send_confirmation_email_path: "profile/send_confirmation_mail",
  update_profile_user_path: "profile/update",
  update_password_profile_user_path: "profile/update_password",
  profile_endorsement_user_path: "profile/endorsement",
  profile_update_membership_path: "profile/update_membership",
  profile_weekend_bookings_path: "profile/weekend_bookings",
  profiles_pay_to_wait_list_path: "profiles/pay_to_wait_list",

  user_groups_path: "groups",
  user_groups_send_invitations_path: "groups/send_invitations",
  user_groups_remove_invitation_path: "groups/remove_invitation",

  user_dashboard_booking_path: "dashboard/booking_datatable",
  user_dashboard_transaction_path: "dashboard/transaction_datatable",

  user_bookings_path: "bookings",
  user_bookings_booking_data_in_month_path: "bookings/booking_data_in_month",
  user_bookings_boat_class_prices_in_days: "bookings/boat_class_prices_in_days",
  user_bookings_get_booking_validation_path: "bookings/get_booking_validation",

  user_settings_path: "settings",
  user_get_setting_value_by_var_path: "settings/get_value_by_var",

  search_boat_classes_path: "boat_classes/search",

  user_charges_path: "charges",

  user_lessons_path: "lessons",

  //Shared route
  get_card_path: "stripes/get_card",
  create_card_path: "stripes/create_card",
  update_card_meta: "stripes/update_card_meta",
  destroy_card_path: "stripes/destroy_card",
  microdeposit_path: "stripes/microdeposit",
  update_default_source_path: "stripes/update_default_source",

  //e-commerce extras routes
  addons_path: "admin/addons",
  admin_booking_addons_path: "admin/booking_addons",
  user_booking_addons_path: "booking_addons",
  admin_assign_booking_addons: "admin/booking_addons/assign_booking_addons",
  user_assign_booking_addons: "booking_addons/assign_booking_addons",
  get_addon_available_for_adding_path: "addons/addon_available_for_adding",

  //boatclass waitlist
  admin_waitlists_path: "admin/boat_class_waitlists",
  user_waitlists_path: "boat_class_waitlists"
};

const CONSTANT = {
  PAGING: {
    NUM_OF_ROW: 10
  },
  BOAT_STATUS: {
    total: -1,
    dock: 0,
    in_use: 1,
    yard: 2,
    need_attention: 3,
    processing: 4,
    refuel: "refuel"
  },
  ROLE: {
    admin: {
      name: "admin"
    },
    dock: {
      name: "dock"
    },
    daily: {
      name: "daily"
    },
    user_single: {
      name: "user_single"
    },
    unlimited: {
      name: "unlimited"
    }
  },
  MAIN_ROLE: {
    admin: "admin",
    dock: "dock",
    user: "user",
    unlimited: "unlimited",
    daily: "daily",
    mid_week: "mid_week"
  },
  MEMBERSHIP_TYPE: {
    daily: "daily",
    full: "full",
    mid_week: "mid_week",
    shared: "shared",
    unlimited: "unlimited"
  },
  CHARGE_TYPE: {
    security_deposit: {
      key: "security_deposit",
      text: "Security Deposit"
    },
    membership: {
      key: "membership",
      text: "Membership"
    },
    booking: {
      key: "booking",
      text: "Booking"
    },
    fuel: {
      key: "fuel",
      text: "Fuel"
    },
    cleaning: {
      key: "cleaning",
      text: "Cleaning"
    },
    damage: {
      key: "damage",
      text: "Damage"
    },
    other: {
      key: "other",
      text: "Other"
    },
    auto_fee: {
      key: "auto_fee",
      text: "Auto Fee"
    },
    e_commerce: {
      key: "e_commerce",
      text: "E-commerce"
    },
    booking_security_deposit: {
      key: "booking_security_deposit",
      text: "Security Deposit"
    }
  },
  CHARGE_STATUS: {
    created: "created",
    succeeded: "succeeded",
    pending: "pending",
    failed: "failed",
    refunded: "refunded"
  },
  BOOKING_STATUS: {
    tba: "tba",
    confirmed: "confirmed",
    in_use: "in_use",
    checked_in: "checked_in",
    completed: "completed",
    cancelled: "cancelled",
    processing: "processing"
  },
  DATE_FORMAT: "YYYY-MM-DD",
  DATE_FORMAT_DISPLAY: "MM/DD/YYYY",
  DATE_TIME_FORMAT_DISPLAY: "MM/DD/YYYY hh:mm a",
  BOOKING_LINE_ITEM_TYPE: {
    boolean: "boolean",
    fuel_gauge: "fuel_gauge",
    meter_reading: "meter_reading"
  },
  MAX_TANK_SIZE: 16,
  MEMBERSHIP_STATUS: {
    UNPAID: "unpaid",
    PAID: "paid",
    EXPIRED: "expired"
  },
  cutOffTime: 10,
  departureTimes: [
    "",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "01:00pm",
    "01:30pm",
    "02:00pm",
    "02:30pm",
    "03:00pm",
    "03:30pm",
    "04:00pm",
    "04:30pm",
    "05:00pm",
    "05:30pm",
    "06:00pm"
  ],
  dayOfWeekIndex: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  membershipWaitlistStatus: {
    requested: "requested",
    approved: "approved",
    closed: "closed"
  },
  BOOKING_ADDON_STATUS: {
    paid: "paid",
    unpaid: "unpaid",
    cancelled: "cancelled"
  },
  sosTypeObj: {
    boat_leaking: {
      name: "BOAT IS LEAKING",
      icon: "ios-bonfire"
    },
    need_aid: {
      name: "NEED FIRST AID",
      icon: "ios-medkit-outline"
    },
    had_collision: {
      name: "HAD A COLLISION",
      icon: "ios-cafe"
    },
    engine_not_start: {
      name: "ENGINE ISN'T STARTING",
      icon: "ios-cart"
    },
    man_overboard: {
      name: "MAN OVERBOARD",
      icon: "ios-copy"
    },
    no_fuel: {
      name: "NO FUEL",
      icon: "ios-flame"
    }
  },
  serviceRequestTypeObj: {
    ice: {
      name: "ICE",
      icon: "ios-snow-outline"
    },
    water: {
      name: "WATER",
      icon: "ios-water-outline"
    },
    ski_pack: {
      name: "SKI PACK",
      icon: "ios-beer-outline"
    },
    picnic_box: {
      name: "PICNIC BOX",
      icon: "ios-beer-outline"
    },
    cooler_and_ice: {
      name: "COOLER AND ICE",
      icon: "ios-beer-outline"
    }
  },
  BOAT_CLASS: {
    default_color: "#00bcd4"
  },
  boatClassChangedMode: {
    boatClass: "boatClass",
    alternativeBoatClass: "alternativeBoatClass"
  },
  bookingType: {
    normal: "normal",
    happy_hour: "happy_hour",
    admin_use: "admin_use",
    lesson_use: "lesson_use"
  }
};

const IMAGES = {
  make_a_booking: "/imgs/app/make-a-booking.png",
  happy_hour_booking: "/imgs/app/happy-hour-booking.png",
  profile_icon: "/imgs/app/profile-icon.png",
  sailor: "/imgs/app/sailor.png",
  bank: "/imgs/app/bank.png",
  credit_card: "/imgs/app/credit-card.png",
  no_image: "/imgs/app/no-image-available.jpg",
  boat: "/imgs/app/boat.png",
  boat_happy_hour: "/imgs/app/hhour.png",
  contact_icon: "/imgs/app/contact-icon.png",
  powered_by_stripe_icon: "/imgs/app/powered_by_stripe.png",
  logo_boat: "/imgs/common/logo-boat.png"
};

const MESSAGES = {
  down_for_maintenance: "Sorry for the inconvenience but we're performing some maintenance at the moment.",
  email_has_been_confirmed: "Your email address has been confirmed. Thanks!",
  charge_remove_successfully: "Charge was removed successfully!",
  registration_successfully: "Registration successfully!",
  red_flag_should_complete: "Need finish all endorsements before Start Booking!",
  boat_should_assign: "Need assign boat before Start Booking!",
  booking_payment_should_finish: "Need make payment before Start Booking!",
  booking_charge_request_successfully: "Booking charge request performed successfully!",
  user_profile_update_successfully: "User profile updated successfully!",
  new_charge_created_successfully: "A new charge has been created successfully!",
  remove_ref_charge_successfully: "Reference charge removed successfully!",
  change_password_successfully: "Your password has been changed successfully.",
  happy_hour_not_open: "Happy Hour booking doesn't open until 4.pm",
  happy_hour_all_day_mid_season: "Happy Hour Prices all day during Mid Season.",
  fuel_charge_need_added: "Need adding fuel charge before Check In Boat!",
  pending_charge_need_pay: "Need pay all pending charges before Complete Booking!",
  need_to_select_payment_method: "Please select payment method",
  need_to_select_2nd_payment_method: "Please select payment method for split charge",
  need_to_select_user_before_creating_booking: "Please select user for this booking",
  need_to_select_boat_class_before_creating_booking: "Please select Boat class for this booking",
  need_to_select_booking_days_before_creating_booking: "Please select booking days",
  need_to_select_date: "Please select date",
  booking_mid_week: "Mid Week membership cannot book on weekend/holidays.",
  email_not_verified_before_booking: "You can not make a booking until your email got verified",
  booking_membership_shared_group_need_paid:
    "A minimum of 2 members from the group must pay their membership before the group is active and the active members can make a booking.",
  booking_membership_need_paid: "You can not make a booking until you pay membership fee",
  something_wrong: "Something went wrong, please try again later!",
  card_need_added: "You need to add card payment before make a booking.",
  checklist_not_valid: "Compulsory Booking checklist field is empty!",
  cannot_start_booking_not_today: "Cannot Start Booking. Booking can only start on Booking Start Date",
  boat_assigned_successfully: "Boat assigned successfully!",
  need_to_select_departure_time: "Please select your departure time!",
  fuel_tank_is_full: "Fuel tank is full already. Cannot fill up!",
  cannot_send_confirmation_mail: "Cannot send confirmation instructions.",
  dates_not_change_when_edit_booking: "Dates need to be changed when edit booking",
  pay_to_waiting_list_success: "Pay to waiting list success!",
  addon_added_successfully: "Add-on added successfully!",
  addon_remove_successfully: "Add-on was removed successfully!",
  update_admin_note_for_user_successfully: "Admin note added successfully!",
  remove_admin_note_for_user_successfully: "Admin note removed successfully!",
  waitlist_added_successfully: "You have been added to the waitlist successfully!",
  waitlist_admin_added_successfully: "User have been added to the waitlist successfully!",
  failed_to_load_user_cards: "Failed to load user's cards!"
};

//TODO: Should use redux state instead
let state = {
  user: {
    role: CONSTANT.MAIN_ROLE.user
  }
};

const RESPONSE_CODE = {
  no_setting_available: "no_setting_available"
};

const API_KEY = {
  google_map: "AIzaSyAh0zvg1DjAWF9IW9o8C_GYogxc_YI5VXc"
};

export { URL_CONFIG, CONSTANT, MESSAGES, IMAGES, RESPONSE_CODE, API_KEY, state };
