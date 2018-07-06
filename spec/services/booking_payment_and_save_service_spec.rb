require "rails_helper"

describe BookingPaymentAndSaveService do
  before(:each) do
    Setting.booking_charge_sale_tax = false
    Setting.e_commerce_charge_sale_tax = false
    RemindBookingService.any_instance.stub(perform: nil)

    charge_mailer_class_double = class_double('ChargeMailer').as_stubbed_const({
      transfer_nested_constants: true
    })
    charge_mailer = double('ChargeMailer')
    allow(charge_mailer).to receive(:deliver_later).and_return(true)
    allow(charge_mailer_class_double).to receive(:new_charge_email).and_return(charge_mailer)
  end

  it "should create 2 charges for new booking with addons" do
    booking = build(
      :booking,
      user: create(
        :user,
        balance: 110,
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon),
          quantity: 2
        )
      ],
      payment_methods: ["user_balance"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform
    expect(booking.charges.length).to eq(2)
    expect(booking.charges.first.charge_type).to eq("booking")
    expect(booking.charges.last.charge_type).to eq("e_commerce")

    expect(booking.charges.first.status).to eq("succeeded")
    expect(booking.charges.last.status).to eq("succeeded")

    expect(booking.charges.first.amount).to eq(100)
    expect(booking.charges.last.amount).to eq(10)

    expect(booking.user.balance).to eq(0)
  end

  it "should create 3 charges (1 for booking, 2 for e_commerce) for new booking with addons in case not enough balance" do
    booking = build(
      :booking,
      user: create(
        :user,
        balance: 105,
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon),
          quantity: 2
        )
      ],
      payment_methods: ["user_balance", "cash"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform
    expect(booking.charges.length).to eq(3)

    first_charge = booking.charges[0]
    second_charge = booking.charges[1]
    last_charge = booking.charges[2]
    expect(first_charge.charge_type).to eq("booking")
    expect(second_charge.charge_type).to eq("e_commerce")
    expect(last_charge.charge_type).to eq("e_commerce")

    expect(first_charge.status).to eq("succeeded")
    expect(second_charge.status).to eq("succeeded")
    expect(last_charge.status).to eq("succeeded")

    expect(first_charge.source).to eq("user_balance")
    expect(second_charge.source).to eq("user_balance")
    expect(last_charge.source).to eq("cash")

    expect(first_charge.amount).to eq(100)
    expect(second_charge.amount).to eq(5)
    expect(last_charge.amount).to eq(5)
  end

  it "should create 3 charges (1 for booking, 2 for e_commerce) for new booking with addons in case not enough balance, tax included" do
    Setting.booking_charge_sale_tax = true
    Setting.e_commerce_charge_sale_tax = true
    Setting.sale_tax_percent = 10
    # Charges created:
    # 1. amount: 90, source: user_balance, amount_after_tax: 105
    # 2. amount: 9, source: cash, amount_after_tax: 5
    # 3. amount: 9, source: cash, amount_after_tax: 11

    booking = build(
      :booking,
      user: create(
        :user,
        balance: 105,
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon),
          quantity: 2
        )
      ],
      payment_methods: ["user_balance", "cash"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform

    expect(booking.charges.length).to eq(3)

    first_charge = booking.charges[0]
    second_charge = booking.charges[1]
    last_charge = booking.charges[2]
    expect(first_charge.charge_type).to eq("booking")
    expect(second_charge.charge_type).to eq("booking")
    expect(last_charge.charge_type).to eq("e_commerce")

    expect(first_charge.status).to eq("succeeded")
    expect(second_charge.status).to eq("succeeded")
    expect(last_charge.status).to eq("succeeded")

    expect(first_charge.source).to eq("user_balance")
    expect(second_charge.source).to eq("cash")
    expect(last_charge.source).to eq("cash")

    expect(first_charge.amount_after_tax.round(2)).to eq(105)
    expect(second_charge.amount_after_tax.round(2)).to eq(5)
    expect(last_charge.amount_after_tax.round(2)).to eq(11)
  end

  it "should create 3 charges (2 for booking, 1 for e_commerce) for new booking with addons in case not enough balance" do
    booking = build(
      :booking,
      user: create(
        :user,
        balance: 10,
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon),
          quantity: 2
        )
      ],
      payment_methods: ["user_balance", "cash"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform
    expect(booking.charges.length).to eq(3)

    first_charge = booking.charges[0]
    second_charge = booking.charges[1]
    last_charge = booking.charges[2]
    expect(first_charge.charge_type).to eq("booking")
    expect(second_charge.charge_type).to eq("booking")
    expect(last_charge.charge_type).to eq("e_commerce")

    expect(first_charge.status).to eq("succeeded")
    expect(second_charge.status).to eq("succeeded")
    expect(last_charge.status).to eq("succeeded")

    expect(first_charge.source).to eq("user_balance")
    expect(second_charge.source).to eq("cash")
    expect(last_charge.source).to eq("cash")

    expect(first_charge.amount).to eq(10)
    expect(second_charge.amount).to eq(90)
    expect(last_charge.amount).to eq(10)
  end

  it "should create 1 charges in cash for new booking without addons" do
    booking = build(
      :booking,
      user: create(
        :user,
        balance: 110,
      ),
      payment_methods: ["cash"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform
    expect(booking.charges.length).to eq(1)
    expect(booking.charges.first.charge_type).to eq("booking")

    expect(booking.charges.first.status).to eq("succeeded")
    expect(booking.charges.first.source).to eq("cash")

    expect(booking.charges.first.amount).to eq(100)
    expect(booking.user.balance).to eq(110)
  end

  it "shouldnot create any charge type e_commerce for 0 price addon" do
    booking = build(
      :booking,
      user: create(
        :user,
        balance: 110,
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon, price: 0),
          quantity: 2
        )
      ],
      payment_methods: ["cash"]
    )
    staff = create(:user)

    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform

    expect(booking.charges.length).to eq(1)
    expect(booking.charges.first.charge_type).to eq("booking")

    expect(booking.charges.first.status).to eq("succeeded")
    expect(booking.charges.first.source).to eq("cash")

    expect(booking.charges.first.amount).to eq(100)
    expect(booking.user.balance).to eq(110)
  end

  it "should link all created transactions to booking" do
    Setting.booking_charge_sale_tax = true
    Setting.e_commerce_charge_sale_tax = true
    Setting.sale_tax_percent = 10

    booking = build(
      :booking,
      user: create(
        :user,
        balance: 105
      ),
      booking_addons: [
        create(
          :booking_addon, 
          addon: create(:addon),
          quantity: 2
        )
      ],
      payment_methods: ["user_balance", "cash"]
    )
    staff = create(:user)
    BookingAmountDetailService.any_instance.stub(perform: { amount: 100, amount_detail: {} })
    BookingPaymentAndSaveService.new(booking, staff).perform
    expect(booking.transactions.length).to eq(6)
    booking.transactions.each { |transaction| expect(transaction.booking_id).to eq(booking.id) }

    expect(booking.transactions[0].amount.round(2)).to eq(95.45)
    expect(booking.transactions[1].amount.round(2)).to eq(9.55)
    expect(booking.transactions[2].amount.round(2)).to eq(4.55)
    expect(booking.transactions[3].amount.round(2)).to eq(0.45)
    expect(booking.transactions[4].amount.round(2)).to eq(10)
    expect(booking.transactions[5].amount.round(2)).to eq(1)
  end
end
