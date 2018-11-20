provider "helm" {
    kubernetes {
          host                   = "${azurerm_kubernetes_cluster.cocoonaks.kube_config.0.host}"
          client_certificate     = "${base64decode(azurerm_kubernetes_cluster.cocoonaks.kube_config.0.client_certificate)}"
          client_key             = "${base64decode(azurerm_kubernetes_cluster.cocoonaks.kube_config.0.client_key)}"
          cluster_ca_certificate = "${base64decode(azurerm_kubernetes_cluster.cocoonaks.kube_config.0.cluster_ca_certificate)}"
    }
}


resource "helm_release" "virtual-kubelet" {
    name      = "virtual-kubelet"
    chart     = "https://github.com/virtual-kubelet/virtual-kubelet/raw/master/charts/virtual-kubelet-latest.tgz"

    set {
        name  = "provider"
        value = "azure"
    }

    set {
        name = "providers.azure.targetAKS"
        value = "true"
    }

}
