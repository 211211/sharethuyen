test_pricing_boat_class = BoatClass.create({
  name: 'Long Range Cruiser',
  price_season_peak: 90,
  price_season_peak_hh: 50,
  price_season: 200,
  price_season_hh: 110,
  color_hex: "#673ab7"
})

BoatClass.create([{
    name: 'Class A',
    price: 10
  }, {
    name: 'Class B',
    price: 100,
    color_hex: '#607d8b'
  }, {
    name: 'Class C',
    price: 130
  }, {
    name: 'Class D',
    price: 40
  }, {
    name: 'Class E',
    price: 50
  }, {
    name: 'Class F',
    price: 130
  }
])

test_pricing_boat = Boat.create({
  name:  'Bayliner 3818',
  description: 'Perfect for long range cruising, just ask Jim.',
  boat_class: test_pricing_boat_class
})

BoatImage.create({
  remote_image_url_url: 'https://boatshare-staging.s3-us-west-2.amazonaws.com/uploads/bayliner3818.jpeg',
  boat: test_pricing_boat,
  is_primary: true
})

ragal_boat = Boat.create({
  name:  'Regal 2565',
  description: 'Cuddy cruiser, overnight, family fun \n Forward dinette converts to bunk, aft bunk',
})

Boat.create([{
  name:  'Chaparral 256',
  description: 'Day cruiser, family fun'
}, {
  name:  'Searay Sundancer 260',
  description: 'Searay Sundancer 260'
}])

12.times { |i|
  Boat.create({
    name: 'Boat ' + i.to_s,
    description: 'Description of boat ' + i.to_s
  })
}

dock_admin = User.create({
  email: 'dock_admin@example.com',
  password: '123456'
})

dock_admin.add_role :dock

user_single = User.create({
  email: 'user_single@example.com',
  password: '123456',
  first_name: 'Su',
  last_name: 'Tran'
})

user_single.add_role :user_single

user_su_tran = User.create({
  email: 'trannguyentiensu@gmail.com',
  password: '123456',
  first_name: 'Su',
  last_name: 'Tran'
})

user_su_tran.boat_classes << test_pricing_boat_class

user_su_tran.add_role :user_single

BoatAmenity.create([{
  name: 'Toilet',
  icon: 'icon-fontello-toilet'
}, {
  name: 'TV',
  icon: 'icon-simple-line-icons-screen-desktop'
}, {
  name: 'TV',
  icon: 'icon-simple-line-icons-screen-desktop'
}, {
  name: 'Wifi',
  icon: 'icon-ikons-wifi-3'
}])

BillingAddress.create([{
  user: user_single,
  line1: '123 Abc street',
  line2: '456 Def street',
  city: 'Seattle',
  zip: '12345',
  country: 'US'
}, {
  user: user_single,
  line1: '5 Downing street',
  line2: '5 Steve street',
  city: 'New York',
  zip: '12345',
  country: 'US'
}])

classB = BoatClass.find_by( name: 'Class B')

Booking.create([{
  boat_class: classB,
  user: user_single,
  start_date: "2016-10-05".to_date,
  end_date: "2016-10-10".to_date,
  charges: [
    Charge.new({
      amount: 100,
      charge_type: :booking,
      staff: User.first
    })
  ]
}, {
  boat_class: classB,
  user: user_single,
  start_date: "2016-10-13".to_date,
  end_date: "2016-10-17".to_date,
  charges: [
    Charge.new({
      amount: 100,
      charge_type: :booking,
      staff: User.first
    })
  ]
}, {
  boat_class: classB,
  user: user_single,
  start_date: "2016-10-20".to_date,
  end_date: "2016-10-23".to_date,
  charges: [
    Charge.new({
      amount: 100,
      charge_type: :booking,
      staff: User.first
    })
  ]
}, {
  boat_class: classB,
  user: user_single,
  start_date: "2016-08-20".to_date,
  end_date: "2016-08-23".to_date,
  charges: [
    Charge.new({
      amount: 100,
      charge_type: :booking,
      staff: User.first
    })
  ]
}])

sharedGroup1 = Group.new({
  name: 'Group 1'
})
sharedGroup1.shared!

user_single = User.find_by email: 'user_single@example.com'
sharedGroup1.users << user_single
