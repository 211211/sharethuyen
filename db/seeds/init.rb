['admin', 'dock', 'user_single', 'mid_week'].each do |role_name|
  Role.create! name: role_name
end

admin = User.create({
  email: 'admin@example.com',
  password: '123456',
  first_name: 'Test',
  last_name: 'Test'
})

admin.add_role :admin
