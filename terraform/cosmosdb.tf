resource "azurerm_cosmosdb_account" "db" {
  name                = "${var.prefix}-cocoonaks"
  location            = "${azurerm_resource_group.cocoonaks.location}"
  resource_group_name = "${azurerm_resource_group.cocoonaks.name}"
  offer_type          = "Standard"
  kind                = "MongoDB"

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

    geo_location {
    location          = "${azurerm_resource_group.cocoonaks.location}"
    failover_priority = 0
  }


}

output "MONGODB" {
  value = "${azurerm_cosmosdb_account.db.connection_strings[0]}"
}

