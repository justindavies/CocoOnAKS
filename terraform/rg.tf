
resource "azurerm_resource_group" "cocoonaks" {
  name     = "cocoonaks"
  location = "${var.location}"
}

resource "azurerm_resource_group" "cocoonaks-aci" {
  name     = "cocoonaks-aci"
  location = "${var.location}"
}