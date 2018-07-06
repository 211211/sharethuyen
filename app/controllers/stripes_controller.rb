class StripesController < ApplicationController
  before_action :authenticate_user!

  #TODO: Need secure this method
  def get_card
    user = User.find params[:id]
    if !user.stripe_customer_id.present?
      render json: { message: 'This user doesnot have stripe customer id!' }
    else
      render json: StripeService.get_card(user.stripe_customer_id)
    end
  end

  def create_card
    user = User.find_by_email params[:email]
    if user.stripe_customer_id.present?
      address_id = params[:address_id]
      customer = Stripe::Customer.retrieve(user.stripe_customer_id)
      if params[:billingMode] == 'add'
        billing_address = user.billing_addresses.create!(user_billing_address_params)
        address_id = billing_address.id
      end
      card_source = customer.sources.create({
        source: params[:stripeToken],
        metadata: {
          address_id: address_id
        }
      })
      user_serialized = ActiveModelSerializers::SerializableResource.new(user)
      render json: { message: 'New card linked to existing customer!', user: user_serialized.as_json, card_source: card_source }
    else
      customer = Stripe::Customer.create({
        email: user.email,
        source: params[:stripeToken],
      })

      user.stripe_customer_id = customer.id

      if user.save
        address_id = params[:address_id]
        if params[:billingMode] == 'add'
          billing_address = user.billing_addresses.create!(user_billing_address_params)
          address_id = billing_address.id
        end
        card = customer.sources.data[0]
        card.metadata = {
            address_id: address_id
        }
        card.save

        user_serialized = ActiveModelSerializers::SerializableResource.new(user)
        render json: { message: 'Stripe customer created. New card linked!', user: user_serialized.as_json, card_source: card }
      else
        render :json => { errors: user.errors }, :status => :bad_request
      end
    end
  end

  def update_default_source
    user = User.find_by_email params[:email]
    default_source = params[:default_source]
    StripeService.update_default_source(user.stripe_customer_id, default_source)
    render json: { message: t(:stripe_update_default_source_successfully) }
  end

  def update_card_meta
    user = User.find_by_email params[:email]
    if user.stripe_customer_id.present?
      address_id = params[:address_id]
      if params[:mode] == 'add'
        billing_address = user.billing_addresses.create!(user_billing_address_params)
        address_id = billing_address.id
      end
      customer = Stripe::Customer.retrieve(user.stripe_customer_id)
      card = customer.sources.retrieve(params[:stripeToken])
      card.metadata = {
        address_id: address_id
      }
      card.save

      user_serialized = ActiveModelSerializers::SerializableResource.new(user)
      render json: { message: 'Card metadata updated successfully!', user: user_serialized }
    else
      render json: { message: 'This user does not have stripe customer id!' }
    end
  end

  def destroy_card
    user = User.find_by_email params[:email]
    if !user.stripe_customer_id.present?
      render json: { message: 'This user does not have stripe customer id!' }
    elsif user.is_not_able_to_remove_payment_method
      render_message_error_growl('You have at least one active booking so you are not able to remove payment method!')
    else
      customer = Stripe::Customer.retrieve(user.stripe_customer_id)
      customer.sources.retrieve(params[:stripeToken]).delete()
      render json: { message: 'Card remove successfully!' }
    end
  end

  def microdeposit
    user = User.find_by_email params[:email]

    if user.stripe_customer_id.present?
      customer = Stripe::Customer.retrieve(user.stripe_customer_id)
      bank_account = customer.sources.retrieve(params[:bank_account_id])
      bank_account.verify(amounts: [params[:first_amount], params[:second_amount]])
      render json: { message: 'Microdeposit performed successfully!' }
    else
      render json: { message: 'This user doesnot have stripe customer id!' }
    end
  end

  def user_billing_address_params
    params.require(:billing_address).permit(:id, :line1, :line2, :city, :state, :zip, :country)
  end
end
