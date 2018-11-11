

resource "azurerm_servicebus_namespace" "cocoonaks" {
  name                = "${var.prefix}-cocoonaks"
  location            = "${var.location}"
  resource_group_name = "${azurerm_resource_group.cocoonaks.name}"
  sku                 = "standard"

  tags {
    source = "terraform"
  }
}

resource "azurerm_servicebus_topic" "images" {
  name                = "images"
  resource_group_name = "${azurerm_resource_group.cocoonaks.name}"
  namespace_name      = "${azurerm_servicebus_namespace.cocoonaks.name}"

}

output "SERVICEBUS_NAMESPACE" {
  value = "${azurerm_servicebus_namespace.cocoonaks.name}"
}

output "SERVICEBUS_ACCESSKEY_NAME" {
  value = "RootManageSharedAccessKey"
}

output "SERVICEBUS_ACCESSKEY" {
  value = "${azurerm_servicebus_namespace.cocoonaks.default_primary_key}"
}
