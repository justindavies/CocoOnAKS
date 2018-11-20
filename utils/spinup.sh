cd ../terraform
terraform init
terraform apply

../utils/create_kube_secrets.sh | kubectl apply -f -