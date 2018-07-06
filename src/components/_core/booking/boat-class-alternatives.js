import React from "react";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Radio, Media } from "@sketchpixy/rubix";
import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import BookingUtil from "../../../common/booking-util";
import { isNil } from "lodash/lang";

@inject("store", "newBookingStore")
@observer
export default class BoatClassAlternatives extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  render() {
    const { boat_class_prices, boat_class_prices_loading, boat_class } = this.booking;
    const { booking_settings } = this.props;
    const boatClassId = !isNil(boat_class) && !isNil(boat_class.id) ? boat_class.id : undefined;
    return (
      <div style={{ position: "relative" }}>
        <h4>Alternatively you may select to book from the available boat classes indicated below.</h4>
        <Loader loaded={!boat_class_prices_loading} />
        {boat_class_prices && boat_class_prices.length == 0 && <em>There is no alternative boat class option</em>}
        {boat_class_prices &&
          boat_class_prices.map(prices_data => {
            const { boat_class, prices } = prices_data;
            let price_sum = 0;
            let price_tokens = [];
            for (let dateInStr in prices) {
              const price = prices[dateInStr].price || 0;
              price_sum += price;
              price_tokens.push(`$${price}`);

              const date = moment(dateInStr);
              if (BookingUtil.isBlockoutDate(booking_settings, date, boat_class)) {
                return null;
              }
              if (BookingUtil.isBookingMissDeadline(booking_settings, date).isBlock) {
                return null;
              }
            }
            let price_text = price_tokens.join(" + ") + " = $" + price_sum;
            return (
              <Radio
                className="boat-select-radio"
                name="boat-class-alternatives"
                defaultValue={boat_class.id}
                key={boat_class.id}
                checked={boat_class.id == boatClassId}
                onChange={() => {
                  this.onSelectBoatClassRadio(prices_data);
                }}
              >
                <Media>
                  <Media.Body>
                    <p className="boat-name">{boat_class.name}</p>
                    <span className="boat-info">Price: {price_text}</span>
                  </Media.Body>
                </Media>
              </Radio>
            );
          })}
      </div>
    );
  }

  onSelectBoatClassRadio(prices_data) {
    const { boat_class, prices } = prices_data;
    this.booking.boatClassChangedMode = CONSTANT.boatClassChangedMode.alternativeBoatClass;
    this.booking.boat_class = boat_class;
    this.buildAmountDetail(prices);
  }

  buildAmountDetail(prices) {
    this.booking.clearAmountDetail();
    const { end_date } = this.booking;
    let from_date = this.booking.start_date.clone();
    while (from_date <= end_date) {
      const price = prices[from_date.format(CONSTANT.DATE_FORMAT)].price || 0;
      this.booking.addNewAmountDetail(from_date.format(CONSTANT.DATE_FORMAT), price);
      from_date.add(1, "day");
    }
  }
}
