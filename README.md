# Demo for the Open Source Summit - Edinburgh 2018

This is a challenge I set myself to use Open Source components to demonstrate how great Cloud, and specifically Azure is.

The challenge was to use Machine Learning to churn through A LOT of data and do something with it.  I wanted it to be cool, but also a good demomnstration of how Cloud Services and OSS can work together to reduce the amount of time you would need to get an MVP up and running.

## Cloud Services Used
* Cosmos DB
* Azure Service Bus
* Azure Web Apps (for Containers)
* Azure Storage
* Azure Kubernetes Service

## Open Source Frameworks and Languages used
* Node
* React
* Python
* Express
* Tensorflow and Keras


## Architecture
![alt text](cocoonaksarch.png "Cloud Architecture")


## Data 
For the data to ingest and test I used the [COCO unlabelled images](http://images.cocodataset.org/zips/unlabeled2017.zip)

You can use anything you like, just put it on a storage account.

## Caveats
This is a demo running on Azure - as such it is tightly coupled to some of our services.  In  [infer.py](./infer/infer.py) for example, we poll on the Azure Event Hub to see when a new message is received (in this case, the relative path of an image stored on Azure Blob Storage), it is then that the infer worker will pull the message of the queue and then process it.  As we scale the pods up using ACI/Virtual Kubelet, the queueing mechanism is the key to making sure we have consistency.

# Setup the demo

You will need the following Azure Services:

* Service Bus
* CosmosDB
* Azure Blob Storage


Place the following information in the [envs_template.sh](./utils/envs_template.sh) and [infer_secrets_template.yml](./kubernetes/infer_secrets_template.yml) files.  We use the connection details for both the Inference model on Kubernetes, as well as to inject data into the Service Bus (so that the Inference workers actually do something).

## Event Hub information needed
You will need to capture:

SERVICEBUS_NAMESPACE=*name of your Service Bus*
SERVICEBUS_ACCESSKEY_NAME=RootManageSharedAccessKey (It's usually this)
SERVICEBUS_ACCESSKEY=


## CosmosDB information needed 
**This could be a kube service too, it's using the pymongo and mongoose drivers in the ingest and API stages**

You will need to capture:

MONGODB=*CosmosDB Connection String*


## Azure Storage information needed 

STORAGE_ACCOUNT=*Storage account name*
STORAGE_KEY=*Storage account key*


