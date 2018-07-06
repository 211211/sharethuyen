var assert = require('assert');
import moment from 'moment';
import BookingUtil from '../../src/components/booking/booking-util';

describe('BookingUtil', () => {

  describe('calculateChargableAmount', () => {
    it('should return 0 when passing empty array', () => {
      let result = BookingUtil.calculateChargableAmount([]);
      assert.equal(0, result);
    });

    // it('should return correct calculation on created & failed charges', () => {
    //   var charges = [{
    //     status: 'created',
    //     amount: 100
    //   }, {
    //     status: 'failed',
    //     amount: 150
    //   }, {
    //     status: 'pending',
    //     amount: 150
    //   }]
    //   let result = BookingUtil.calculateChargableAmount(charges);
    //   assert.equal(250, result);
    // });

    it('should return 0 when passing pending & succeeded charges', () => {
      var charges = [{
        status: 'pending',
        amount: 100
      }, {
        status: 'succeeded',
        amount: 150
      }, {
        status: 'pending',
        amount: 150
      }]
      let result = BookingUtil.calculateChargableAmount(charges);
      assert.equal(0, result);
    });
  })
});
