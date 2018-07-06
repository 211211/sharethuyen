class Admin::RolesController < Admin::AdminController

  def index
    roles = Role.all
    render json: { roles: roles }
  end
end
