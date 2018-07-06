Rails.application.routes.draw do
  devise_for :users, :skip => [:sessions, :registrations, :passwords], controllers: { confirmations: 'confirmations' }
  mount StripeEvent::Engine, at: '/stripe_event'

  namespace :api do
    namespace :mobile do
      namespace :admin do
        get 'bookings/today' => 'bookings#today'
        resources :sos, only: [:index] do
          member do
            post 'answer'
          end
        end
        post 'sos/resolve' => 'sos#resolve'
        get 'location' => 'location#index'
        resources :service_request, only: [:index] do
          member do
            post 'answer'
          end
        end
        post 'service_request/resolve' => 'service_request#resolve'
        # TODO: Refactor to apply Rails REST resources here
        get 'inbox/conversations/:id' => 'inbox#show'
        get 'inbox/conversations' => 'inbox#conversations'
        post 'inbox/send' => 'inbox#create'
        get 'inbox/messages' => 'inbox#messages'
      end
      namespace :user do
        get 'bookings/latest' => 'bookings#latest'
        post 'sos/create' => 'sos#create'
        post 'location/latest' => 'location#latest'
        post 'service_request/create' => 'service_request#create'
        post 'inbox/send' => 'inbox#create'
        get 'inbox/messages' => 'inbox#messages'
        put "profile/update" => "profile#update"
      end
      get 'current_user' => 'mobile#get_current_user'
    end
  end

  namespace :admin do
    resources :roles
    resources :groups
    resources :transactions, only: [:index] do
      collection do
        get :export
      end
    end
    resources :settings, only: [:index] do
      collection do
        put 'update_batch' => 'settings#update_batch', :as => :update_batch
        get 'get_value_by_var/:var' => 'settings#get_value_by_var'
        put :update_batch_membership_waitlist
        put :update_value_by_var
        put :update_branding_settings
        get :find_batch
      end
    end
    resources :seasons, only: [:index] do
      collection do
        get :deposit_return_users
      end
    end
    resources :homebase_settings, only: [:index]
    resources :addons do
      collection do
        get :addon_available_for_adding
      end
    end
    resources :booking_addons, only: [:destroy] do
      collection do
        post "assign_booking_addons"
        get "find_by_booking"
      end
    end
    resources :membership_waitlists, only: [:index] do
      member do
        post :approve
      end
    end
    resources :pricing_settings, only: [:index]
    resources :booking_settings, only: [:index] do
      collection do
        get :check_boat_assigned
        post 'unassign_boat' => 'booking_settings#unassign_boat'
      end
    end
    resources :branding_settings, only: [:index]
    resources :email_templates, only: [:index]
    resources :boats do
      collection do
        get :boat_available_for_assigning
        get 'statuses' => 'boats#statuses'
        get 'booking_calendar/:start_date/:end_date' => 'boats#booking_calendar'
      end
      member do
        get 'checklist'
        get 'booking'
      end
    end
    resources :bookings do
      collection do
        get 'new_happy_hour' => 'bookings#new'
        get 'booking_not_assign/:start_date/:end_date' => 'bookings#booking_not_assign'
        get :happy_hour_price
        get :bookings_red_flags
      end
      member do
        post 'pay_now'
        post 'assign_boat'
        put 'start_booking'
        put 'complete_booking'
        put 'process_check_in_boat'
        get 'start'
        get 'complete'
        get 'check_in_boat'
        get 'view_images'
        post 'cancel'
        get 'calculate_refund_amount'
        put 'update_notes'
      end
      resources :booking_images
      resources :booking_line_items do
        collection do
          post 'upload_image'
        end
      end
    end
    resources :charges do
      member do
        put 'update_payment_method'
        post 'pay_now'
        post 'update_amount'
        post 'update_discount_percent'
        post 'request_deposit_return'
      end
    end
    resources :boat_classes do
      collection do
        get :search
      end
    end
    resources :boat_class_waitlists, only: [:index, :create, :destroy]
    resources :boat_class_prices, only: [:index, :update]
    resources :users do
      collection do
        get 'search'
        get 'search_not_belong_group'
        get 'export'
      end
      member do
        post 'update_password'
        get 'endorsement'
        post 'update_endorsement'
        get 'red_flag'
        post 'update_membership'
        post 'return_deposit'
        post 'start_renewal_membership_charge'
        get :bookings
        get :notes
        get :booking_notes
      end
    end
    resources :user_notes, only: [:index, :create, :destroy]
    resources :boat_amenities do
      collection do
        get 'search'
      end
    end
    resources :lessons do
      collection do
        get 'book'
        post 'book'
        get 'search'
      end
    end
    resources :booking_checklist_categories do
      collection do
        get 'search'
      end
    end

    get '/admin_users' => 'admin#admin_users'
    get '/endorsements' => 'endorsements#index'
    get '/dashboard' => 'dashboards#index'
    get '/dashboard/flag_data' => 'dashboards#flag_data'
    get '/boat_fuel_logs' => 'boat_fuel_logs#index'
    post '/boat_fuel_logs/fill_up' => 'boat_fuel_logs#fill_up'
    post '/boat_fuel_logs/edit_fuel' => 'boat_fuel_logs#edit_fuel'
    post '/boat_fuel_logs/change_meter' => 'boat_fuel_logs#change_meter'

    require 'sidekiq/web'
    authenticate :user, lambda { |u| u.is_admin? } do
      mount Sidekiq::Web => '/sidekiq'
    end
  end

  scope module: 'user' do
    get '/dashboard' => 'dashboards#index'
    get '/dashboard_confirmed' => 'dashboards#dashboard_confirmed'
    get '/dashboard/booking_datatable' => 'dashboards#booking_datatable'
    get '/dashboard/transaction_datatable' => 'dashboards#transaction_datatable'
    get '/current_user' => 'dashboards#get_current_user'

    # TODO: Resources should be plurals
    get '/profile' => 'profiles#index'
    put '/profile/update' => 'profiles#update'
    post '/profile/send_confirmation_mail' => 'profiles#send_confirmation_mail'
    post '/profile/update_password' => 'profiles#update_password'
    get '/profile/endorsement' => 'profiles#endorsement'
    post '/profile/update_membership' => 'profiles#update_membership'
    get '/profile/red_flag' => 'profiles#red_flag'
    get '/profile/weekend_bookings' => 'profiles#weekend_bookings'
    post '/profile/start_renewal_membership_charge' => 'profiles#start_renewal_membership_charge'
    resources :profiles, only: [:index] do
      collection do
        post :pay_to_wait_list
      end
    end

    get '/boat_classes/search' => 'boat_classes#search'
    put '/charges/:id/update_payment_method' => 'charges#update_payment_method'
    post '/charges/:id/pay_now' => 'charges#pay_now'
    post '/charges/:id/request_deposit_return' => 'charges#request_deposit_return'
    resources :boat_class_waitlists, only: [:create]
    resources :groups do
      collection do
        post 'send_invitations' => 'groups#send_invitations'
        post 'remove_invitation' => 'groups#remove_invitation'
      end
      member do
        get 'join' => 'groups#join'
        post 'join' => 'groups#join_now'
      end
    end
    resources :bookings, only: [:new, :create, :show] do
      collection do
        get 'new_happy_hour' => 'bookings#new'
        get :booking_data_in_month
        get :boat_class_prices_in_days
        get :happy_hour_price
        get :get_booking_validation
      end
      member do
        post 'pay_now'
        post 'cancel'
        get 'calculate_refund_amount'
      end
    end
    resources :settings, only: [:index] do
      collection do
        get 'get_value_by_var/:var' => 'settings#get_value_by_var'
      end
    end
    resources :lessons, only: [:index, :show] do
      member do
        post 'book'
      end
    end
    get 'addons/addon_available_for_adding' => 'addons#addon_available_for_adding'
    resources :booking_addons, only: [:destroy] do
      collection do
        post "assign_booking_addons"
        get "find_by_booking"
      end
    end
  end

  as :user do
    get '/login' => 'sessions#new', :as => :new_user_session
    post '/login' => 'sessions#create', :as => :user_session
    delete '/logout' => 'sessions#destroy', :as => :destroy_user_session

    post '/register' => 'registrations#create', :as => :user_registration
    get '/register' => 'registrations#new', :as => :new_user_registration
    resources :passwords
  end

  root 'welcome#index'

  resources :stripes, only: [] do
    collection do
      get 'get_card/:id' => 'stripes#get_card', :as => :get_card
      post 'create_card'
      post 'update_card_meta'
      post 'destroy_card'
      post 'microdeposit'
      post 'update_default_source'
    end
  end

  resources :embed_pages, only: [] do
    collection do
      get :inventory
      get :boats
      get 'boats/:id' => 'embed_pages#show_boat', as: :show_boat
    end
  end

end
