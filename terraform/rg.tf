variable "location" {
  description = "Azure datacenter to deploy to."
  default     = "East US"
}

variable "prefix" {
    description = "A prefix used for this installtion to make endpoints unique (storage, Cosmos etc.)"
}

resource "azurerm_resource_group" "cocoonaks" {
  name     = "cocoonaks"
  location = "${var.location}"
}