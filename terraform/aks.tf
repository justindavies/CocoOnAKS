resource "azurerm_kubernetes_cluster" "cocoonaks" {
  name                = "${var.prefix}-cocoonaks"
  location            = "${azurerm_resource_group.cocoonaks.location}"
  resource_group_name = "${azurerm_resource_group.cocoonaks.name}"
  dns_prefix          = "${var.prefix}-cocoonaks"
  kubernetes_version  = "1.11.2"

  agent_pool_profile {
    name            = "default"
    count           = 1
    vm_size         = "Standard_B2s"
    os_type         = "Linux"
  }

    service_principal {
    client_id     = "${var.sp}"
    client_secret = "${var.sp_password}"
  }


}

# output "id" {
#     value = "${azurerm_kubernetes_cluster.cocoonaks.id}"
# }

# output "kube_config" {
#   value = "${azurerm_kubernetes_cluster.cocoonaks.kube_config_raw}"
# }

# output "client_key" {
#   value = "${azurerm_kubernetes_cluster.cocoonaks.kube_config.0.client_key}"
# }

# output "client_certificate" {
#   value = "${azurerm_kubernetes_cluster.cocoonaks.kube_config.0.client_certificate}"
# }

# output "cluster_ca_certificate" {
#   value = "${azurerm_kubernetes_cluster.cocoonaks.kube_config.0.cluster_ca_certificate}"
# }

# output "host" {
#   value = "${azurerm_kubernetes_cluster.cocoonaks.kube_config.0.host}"
# }