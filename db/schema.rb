# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180625074924) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addons", force: :cascade do |t|
    t.string "name"
    t.integer "quantity"
    t.float "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "price_strategy"
  end

  create_table "billing_addresses", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.string "line1"
    t.string "line2"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "country"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_billing_addresses_on_user_id"
  end

  create_table "boat_amenities", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "boat_amenities_boats", id: false, force: :cascade do |t|
    t.integer "boat_id", null: false
    t.integer "boat_amenity_id", null: false
  end

  create_table "boat_class_prices", id: :serial, force: :cascade do |t|
    t.integer "boat_class_id"
    t.integer "price_type"
    t.integer "membership_type"
    t.string "holiday"
    t.float "price", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["boat_class_id"], name: "index_boat_class_prices_on_boat_class_id"
  end

  create_table "boat_class_waitlists", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "boat_class_id"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "reserve_until"
    t.index ["boat_class_id"], name: "index_boat_class_waitlists_on_boat_class_id"
    t.index ["user_id"], name: "index_boat_class_waitlists_on_user_id"
  end

  create_table "boat_classes", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color_hex"
    t.integer "order_number", default: 0
    t.boolean "admin_use", default: false
  end

  create_table "boat_classes_users", id: false, force: :cascade do |t|
    t.integer "boat_class_id"
    t.integer "user_id"
    t.index ["boat_class_id", "user_id"], name: "boat_classes_users_index", unique: true
  end

  create_table "boat_fuel_logs", id: :serial, force: :cascade do |t|
    t.integer "boat_id"
    t.integer "booking_id"
    t.integer "charge_id"
    t.integer "log_type"
    t.boolean "fuel_meter_enabled", default: false
    t.float "meter_before", default: 0.0
    t.float "meter_after", default: 0.0
    t.float "fuel_before", default: 0.0
    t.float "fuel_after", default: 0.0
    t.string "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["boat_id"], name: "index_boat_fuel_logs_on_boat_id"
    t.index ["booking_id"], name: "index_boat_fuel_logs_on_booking_id"
    t.index ["charge_id"], name: "index_boat_fuel_logs_on_charge_id"
  end

  create_table "boat_images", id: :serial, force: :cascade do |t|
    t.string "image_url"
    t.boolean "is_primary"
    t.integer "boat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["boat_id"], name: "index_boat_images_on_boat_id"
  end

  create_table "boat_yard_logs", force: :cascade do |t|
    t.bigint "boat_id"
    t.date "start_date"
    t.date "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["boat_id"], name: "index_boat_yard_logs_on_boat_id"
  end

  create_table "boats", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.integer "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
    t.integer "boat_class_id"
    t.integer "length"
    t.string "engine"
    t.integer "engine_hours"
    t.integer "seating"
    t.integer "bathroom"
    t.integer "capacity"
    t.string "identifier"
    t.string "fuel_consumption"
    t.string "cruising_speed"
    t.string "us_coast_guard_capacity"
    t.date "yard_end_date"
    t.boolean "fuel_meter_enabled", default: false
    t.float "fuel_meter", default: 0.0
    t.float "fuel_rate_of_burn", default: 0.0
    t.integer "fuel_remain", default: 0
    t.decimal "latitude"
    t.decimal "longitude"
    t.datetime "location_updated_at"
    t.index ["boat_class_id"], name: "index_boats_on_boat_class_id"
  end

  create_table "boats_booking_checklist_categories", id: false, force: :cascade do |t|
    t.integer "boat_id"
    t.integer "booking_checklist_category_id"
    t.index ["boat_id", "booking_checklist_category_id"], name: "boats_booking_checklist_categories_index", unique: true
  end

  create_table "booking_addons", force: :cascade do |t|
    t.bigint "addon_id"
    t.integer "quantity"
    t.bigint "booking_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status"
    t.bigint "charge_id"
    t.float "price"
    t.index ["addon_id"], name: "index_booking_addons_on_addon_id"
    t.index ["booking_id"], name: "index_booking_addons_on_booking_id"
    t.index ["charge_id"], name: "index_booking_addons_on_charge_id"
  end

  create_table "booking_checklist_categories", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "booking_checklist_line_items", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_booking_checklist_line_items_on_category_id"
  end

  create_table "booking_images", id: :serial, force: :cascade do |t|
    t.integer "photo_type", default: 0
    t.string "image"
    t.integer "booking_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_booking_images_on_booking_id"
  end

  create_table "booking_line_items", id: :serial, force: :cascade do |t|
    t.integer "booking_id"
    t.integer "booking_checklist_line_item_id"
    t.integer "value"
    t.string "image"
    t.integer "line_item_type", default: 0
    t.string "value_string"
    t.index ["booking_checklist_line_item_id"], name: "index_booking_line_items_on_booking_checklist_line_item_id"
    t.index ["booking_id", "booking_checklist_line_item_id"], name: "bookings_booking_checklist_line_items_index", unique: true
    t.index ["booking_id"], name: "index_booking_line_items_on_booking_id"
  end

  create_table "bookings", id: :serial, force: :cascade do |t|
    t.integer "user_id"
    t.integer "boat_class_id"
    t.integer "boat_id"
    t.date "start_date"
    t.date "end_date"
    t.string "user_notes"
    t.integer "status", default: 0
    t.float "amount"
    t.integer "assigned_staff_id"
    t.integer "activated_staff_id"
    t.integer "completed_staff_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "booking_type", default: 0
    t.datetime "start_booking_at"
    t.string "complete_notes"
    t.datetime "check_in_boat_at"
    t.string "departure_time"
    t.string "amount_detail"
    t.float "discount_percent", default: 0.0
    t.boolean "is_admin_override", default: false
    t.boolean "no_show"
    t.integer "fuel_start"
    t.integer "fuel_end"
    t.string "red_flags"
    t.integer "departure_time_in_sec", default: 0
    t.string "system_notes"
    t.text "discount_notes"
    t.boolean "security_deposit", default: false
    t.float "security_deposit_amount", default: 0.0
    t.index ["activated_staff_id"], name: "index_bookings_on_activated_staff_id"
    t.index ["assigned_staff_id"], name: "index_bookings_on_assigned_staff_id"
    t.index ["boat_class_id"], name: "index_bookings_on_boat_class_id"
    t.index ["boat_id"], name: "index_bookings_on_boat_id"
    t.index ["completed_staff_id"], name: "index_bookings_on_completed_staff_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "charges", id: :serial, force: :cascade do |t|
    t.string "stripe_charge_id"
    t.integer "booking_id"
    t.string "note"
    t.float "amount"
    t.integer "status", default: 0
    t.integer "charge_type", default: 0
    t.integer "staff_id"
    t.float "refund_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "stripe_source_id"
    t.integer "source", default: 0
    t.integer "user_id"
    t.integer "ref_charge_id"
    t.float "sale_tax_percent", default: 0.0
    t.float "discount_percent", default: 0.0
    t.integer "season", default: 2017
    t.boolean "is_renewing", default: false
    t.boolean "requested_return", default: false
    t.boolean "is_current", default: false
    t.date "paid_on"
    t.float "waitlist_deduct_amount"
    t.integer "auto_fee_type"
    t.index ["booking_id"], name: "index_charges_on_booking_id"
    t.index ["ref_charge_id"], name: "index_charges_on_ref_charge_id"
    t.index ["staff_id"], name: "index_charges_on_staff_id"
    t.index ["user_id"], name: "index_charges_on_user_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.bigint "creator_id"
    t.bigint "member_id"
    t.integer "latest_message_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_conversations_on_creator_id"
    t.index ["member_id"], name: "index_conversations_on_member_id"
  end

  create_table "groups", id: :serial, force: :cascade do |t|
    t.integer "membership_type", default: 0
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pending_invitations"
  end

  create_table "lessons", id: :serial, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.float "price"
    t.string "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "membership_waitlists", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "charge_id"
    t.string "membership_type"
    t.float "paid_amount"
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["charge_id"], name: "index_membership_waitlists_on_charge_id"
    t.index ["user_id"], name: "index_membership_waitlists_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "sender_id"
    t.bigint "receiver_id"
    t.bigint "conversation_id"
    t.integer "message_type"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["receiver_id"], name: "index_messages_on_receiver_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "roles", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.integer "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
  end

  create_table "service_request_responses", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "service_request_id"
    t.string "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["service_request_id"], name: "index_service_request_responses_on_service_request_id"
    t.index ["user_id"], name: "index_service_request_responses_on_user_id"
  end

  create_table "service_requests", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "booking_id"
    t.string "message"
    t.string "service_request_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "resolved", default: false
    t.index ["booking_id"], name: "index_service_requests_on_booking_id"
    t.index ["user_id"], name: "index_service_requests_on_user_id"
  end

  create_table "setting_assets", force: :cascade do |t|
    t.string "setting_key"
    t.text "file"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "settings", id: :serial, force: :cascade do |t|
    t.string "var", null: false
    t.text "value"
    t.integer "thing_id"
    t.string "thing_type", limit: 30
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["thing_type", "thing_id", "var"], name: "index_settings_on_thing_type_and_thing_id_and_var", unique: true
  end

  create_table "sos_responses", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "sos_id"
    t.string "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sos_id"], name: "index_sos_responses_on_sos_id"
    t.index ["user_id"], name: "index_sos_responses_on_user_id"
  end

  create_table "soses", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "booking_id"
    t.string "message"
    t.string "sos_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "resolved", default: false
    t.index ["booking_id"], name: "index_soses_on_booking_id"
    t.index ["user_id"], name: "index_soses_on_user_id"
  end

  create_table "transactions", id: :serial, force: :cascade do |t|
    t.integer "booking_id"
    t.integer "staff_id"
    t.float "amount"
    t.string "description"
    t.integer "in_out", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
    t.integer "charge_id"
    t.integer "source", default: 0
    t.string "card_last4"
    t.float "balance"
    t.boolean "is_tax", default: false
    t.integer "user_id"
    t.index ["booking_id"], name: "index_transactions_on_booking_id"
    t.index ["charge_id"], name: "index_transactions_on_charge_id"
    t.index ["staff_id"], name: "index_transactions_on_staff_id"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "user_notes", force: :cascade do |t|
    t.bigint "user_id"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_notes_on_user_id"
  end

  create_table "user_profiles", id: :serial, force: :cascade do |t|
    t.string "wa_state_marine_photo"
    t.string "wa_state_marine_field"
    t.string "driver_license_photo"
    t.string "driver_license_field"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_profiles_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.string "secondary_phone"
    t.string "address"
    t.string "stripe_customer_id"
    t.string "profile_picture"
    t.integer "group_id"
    t.float "balance", default: 0.0
    t.boolean "is_active", default: true
    t.integer "security_deposit_charge_id"
    t.text "endorsement"
    t.string "authentication_token", limit: 30
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.date "membership_valid_until"
    t.integer "membership_status", default: 0
    t.string "fcm_token"
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["group_id"], name: "index_users_on_group_id"
    t.index ["membership_valid_until"], name: "index_users_on_membership_valid_until"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["security_deposit_charge_id"], name: "index_users_on_security_deposit_charge_id"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
  end

  add_foreign_key "billing_addresses", "users"
  add_foreign_key "boat_class_prices", "boat_classes"
  add_foreign_key "boat_class_waitlists", "boat_classes"
  add_foreign_key "boat_class_waitlists", "users"
  add_foreign_key "boat_fuel_logs", "boats"
  add_foreign_key "boat_fuel_logs", "bookings"
  add_foreign_key "boat_fuel_logs", "charges"
  add_foreign_key "boat_images", "boats"
  add_foreign_key "boat_yard_logs", "boats"
  add_foreign_key "boats", "boat_classes"
  add_foreign_key "booking_addons", "addons"
  add_foreign_key "booking_addons", "bookings"
  add_foreign_key "booking_addons", "charges"
  add_foreign_key "booking_images", "bookings"
  add_foreign_key "bookings", "boat_classes"
  add_foreign_key "bookings", "users"
  add_foreign_key "charges", "bookings"
  add_foreign_key "membership_waitlists", "charges"
  add_foreign_key "membership_waitlists", "users"
  add_foreign_key "service_request_responses", "service_requests"
  add_foreign_key "service_request_responses", "users"
  add_foreign_key "service_requests", "bookings"
  add_foreign_key "service_requests", "users"
  add_foreign_key "sos_responses", "soses"
  add_foreign_key "sos_responses", "users"
  add_foreign_key "soses", "bookings"
  add_foreign_key "soses", "users"
  add_foreign_key "transactions", "bookings"
  add_foreign_key "transactions", "charges"
  add_foreign_key "transactions", "users"
  add_foreign_key "user_notes", "users"
  add_foreign_key "user_profiles", "users"
  add_foreign_key "users", "groups"
end
