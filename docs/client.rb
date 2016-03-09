log_level        :info
log_location     STDOUT
chef_server_url  'https://vagrant.vm:443/organizations/default'
validation_client_name 'default-validator'
validation_key '/etc/chef/default-validator.pem'
client_key '/etc/chef/client.pem'
ssl_verify_mode :verify_none
