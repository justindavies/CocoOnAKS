resource "azurerm_storage_account" "cocoonaks" {
  name                     = "${var.prefix}cocoonaks"
  resource_group_name      = "${azurerm_resource_group.cocoonaks.name}"
  location                 = "${azurerm_resource_group.cocoonaks.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "images" {
  name                  = "images"
  resource_group_name   = "${azurerm_resource_group.cocoonaks.name}"
  storage_account_name  = "${azurerm_storage_account.cocoonaks.name}"
  container_access_type = "private"
}

output "STORAGE_ACCOUNT" {
  value = "${azurerm_storage_account.cocoonaks.name}"
}

output "STORAGE_KEY" {
  value = "${azurerm_storage_account.cocoonaks.primary_access_key}"
}
