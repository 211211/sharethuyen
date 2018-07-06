class TransactionService

  def self.build_transaction_from_stripe_charge(staff, stripe_charge, booking, charge, user, in_out = :out, description = "")
    Transaction.new({
      staff: staff,
      amount: stripe_charge.amount / 100.0,
      balance: user.balance,
      status: stripe_charge.status,
      booking: booking,
      charge: charge,
      source: :stripe,
      card_last4: stripe_charge.source.last4,
      description: description,
      in_out: in_out
    })
  end

  def self.create_transactions_from_charge(charge, staff, user_balance, description = nil, card_last4 = nil)
    user_balance_before_tax = charge.source == "user_balance" ? user_balance + charge.amount_of_tax : user_balance
    transaction = Transaction.create!(
      amount: charge.amount_after_discounted,
      balance: user_balance_before_tax,
      status: charge.status,
      booking: charge.booking,
      charge: charge,
      source: charge.source,
      staff: staff,
      description: charge.description,
      card_last4: card_last4
    )

    # Create tax transaction if needed
    if charge.sale_tax_percent.positive?
      Transaction.create!(
        amount: charge.amount_of_tax,
        balance: user_balance,
        status: charge.status,
        booking: charge.booking,
        charge: charge,
        source: charge.source,
        staff: staff,
        description: "WA Sales tax for transaction ##{transaction.id}",
        is_tax: true,
        card_last4: card_last4
      )
    end

    return transaction if charge.waitlist_deduct_amount.blank?
    Transaction.create!(
      amount: charge.waitlist_deduct_amount,
      balance: user_balance,
      status: charge.status,
      booking: charge.booking,
      charge: charge,
      source: charge.source,
      staff: staff,
      description: "Deduct amount for transaction ##{transaction.id}",
      card_last4: card_last4
    )

    transaction
  end

  def self.create_deposit_return_transaction(charge, staff, method = 1)  # 1: ACH, 2: CASH, 3: CHECK, 4: CARD
    source = case method
               when 1
                 Transaction.sources[:stripe]
               when 2
                 Transaction.sources[:cash]
               when 3
                 Transaction.sources[:check]
               when 4
                 Transaction.sources[:stripe]
               else
                 Transaction.sources[:cash]
             end

    method_name = case method
                    when 1
                      'ACH'
                    when 2
                      'CASH'
                    when 3
                      'CHECK'
                    when 4
                      'CARD'
                    else
                      'CASH'
                  end

    Transaction.create!({
                            amount: charge.amount_after_discounted,
                            balance: charge.user.balance,
                            status: Transaction.statuses[:succeeded],
                            charge: charge,
                            source: source,
                            staff: staff,
                            in_out: Transaction.in_outs[:in],
                            description: "Security Deposit return - #{method_name}"
                        })
  end
end
