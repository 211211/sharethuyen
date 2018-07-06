class UpdateSaleTaxChargesJob < ApplicationJob
  queue_as :default

  def perform(new_sale_tax)
    charges = Charge.created

    charges.each do |charge|
      charge.apply_sale_tax_if_needed
      charge.save
    end if charges.present?
  end
end
