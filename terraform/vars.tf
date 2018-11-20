variable "location" {
  description = "Azure datacenter to deploy to."
  default     = "East US"
}

variable "prefix" {
    description = "A prefix used for this installtion to make endpoints unique (storage, Cosmos etc.)"
}


variable "sp" {
  description = "Service Principal Client ID"
}

variable "sp_password" {
  description = "Service Principal Client Password"
}
