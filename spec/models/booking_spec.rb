require 'rails_helper'

describe Booking do

  before(:each) do
    Booking.destroy_all
    User.destroy_all
    BoatClass.destroy_all
    Boat.destroy_all

    @boat_class = create(:boat_class, name: "Boat Class Name")
    @boat = Boat.create!({
      name:  'Chaparral 256',
      description: 'Day cruiser, family fun',
      boat_class: @boat_class
    })
    @user = User.create!({
      email: 'test_booking@example.com',
      phone: '123456',
      password: '123456',
      first_name: 'Test',
      last_name: 'Test'
    })
  end

  describe '.no_boat_available?' do
    it 'return true if there is no boat belonged to boat class to make booking' do

      boat_class = BoatClass.create!({
        name: 'Boat Class B'
      })
      booking = Booking.new({
        start_date: Date.new(2016, 11, 18),
        end_date: Date.new(2016, 11, 22),
        boat_class: boat_class,
        user: @user
      })

      expect(booking.no_boat_available?).to eq(true)
    end

    it 'return false if there is one boat avaiable for booking' do

      booking = Booking.new({
        start_date: Date.new(2016, 11, 18),
        end_date: Date.new(2016, 11, 22),
        boat_class: @boat_class,
        user: @user
      })

      expect(booking.no_boat_available?).to eq(false)
    end

    it 'return true multiple booking cases' do

      Booking.create!({
        start_date: Date.new(2016, 11, 15),
        end_date: Date.new(2016, 11, 18),
        boat_class: @boat_class,
        user: @user
      })
      booking = Booking.new({
        start_date: Date.new(2016, 11, 18),
        end_date: Date.new(2016, 11, 22),
        boat_class: @boat_class,
        user: @user
      })

      expect(booking.no_boat_available?).to eq(true)
    end

    it 'return false multiple booking cases' do

      Booking.create!({
        start_date: Date.new(2016, 11, 15),
        end_date: Date.new(2016, 11, 17),
        boat_class: @boat_class,
        user: @user
      })
      booking = Booking.new({
        start_date: Date.new(2016, 11, 18),
        end_date: Date.new(2016, 11, 22),
        boat_class: @boat_class,
        user: @user
      })

      expect(booking.no_boat_available?).to eq(false)
    end
  end

  describe '.check_in_boat' do
    it 'should update boat status to :dock' do
      booking = Booking.new({
        boat: create(:boat),
        boat_class: create(:boat_class),
        start_date: '2017-02-07',
        end_date: '2017-02-09',
      })

      booking.check_in_boat('', false)
      expect(booking.boat.status).to eq(:dock.to_s)
    end
  end

  describe '.booking_valid_membership?' do
    # it 'should return false on weekend for mid_week member' do
    #   user = User.create({
    #     email: 'user@example.com',
    #     phone: '123456',
    #     password: '123456',
    #     first_name: 'Test',
    #     last_name: 'Test',
    #     membership_charges: [Charge.create({
    #       amount: 100,
    #       charge_type: :membership,
    #       status: :succeeded
    #     })]
    #   })
    #   user.add_role :mid_week
    #
    #   booking = Booking.new({
    #     start_date: Date.new(2016, 01, 12),
    #     end_date: Date.new(2016, 01, 17),
    #     user: user
    #   })
    #
    #   expect(booking.booking_valid_membership?[:key]).to eq(:fail)
    # end

    # it 'should return true on weekday for mid_week member' do
    #   user = User.create({
    #     email: 'user@example.com',
    #     phone: '123456',
    #     password: '123456',
    #     first_name: 'Test',
    #     last_name: 'Test',
    #     membership_charges: [Charge.create({
    #       amount: 100,
    #       charge_type: :membership,
    #       status: :succeeded
    #     })]
    #   })
    #   user.add_role :mid_week
    #
    #   booking = Booking.new({
    #     start_date: Date.new(2016, 01, 12),
    #     end_date: Date.new(2016, 01, 13),
    #     user: user
    #   })
    #
    #   expect(booking.booking_valid_membership?[:key]).to eq(:success)
    # end
  end

  describe '.to_be_assigned' do

    it 'should order by departure time with timelineDay' do
      booking_a = Booking.create!({
        start_date: Date.new(2017, 01, 7),
        end_date: Date.new(2017, 01, 8),
        boat_class: @boat_class,
        user: @user,
        departure_time: '03:00pm'
      })

      booking_b = Booking.create!({
        start_date: Date.new(2017, 01, 7),
        end_date: Date.new(2017, 01, 8),
        boat_class: @boat_class,
        user: @user,
        departure_time: '03:30pm'
      })

      booking_b = Booking.create!({
        start_date: Date.new(2017, 01, 7),
        end_date: Date.new(2017, 01, 8),
        boat_class: @boat_class,
        user: @user,
        departure_time: '11:00am'
      })

      start_date = Date.new(2017, 01, 7)
      end_date = Date.new(2017, 01, 8)
      timeline_view = 'timelineDay'
      result = Booking.to_be_assigned(start_date, end_date, nil, timeline_view)

      expect(result[0].departure_time).to eq('11:00am')
      expect(result[1].departure_time).to eq('03:00pm')
      expect(result[2].departure_time).to eq('03:30pm')
    end
  end
end
