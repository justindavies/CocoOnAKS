from azure.servicebus import ServiceBusService, Message, Queue
import os
import glob
from azure.storage.blob import BlockBlobService, PublicAccess


print("Connecting to Queue...")

bus_service = ServiceBusService(
    service_namespace=os.environ['SERVICEBUS_NAMESPACE'],
    shared_access_key_name=os.environ['SERVICEBUS_ACCESSKEY_NAME'],
    shared_access_key_value=os.environ['SERVICEBUS_ACCESSKEY'])


block_blob_service = BlockBlobService(account_name=os.environ['STORAGE_ACCOUNT'], account_key=os.environ['STORAGE_KEY'])

container_name ='images'
block_blob_service.create_container(container_name)


generator = block_blob_service.list_blobs(container_name)
for blob in generator:
    print("Pushing: " + blob.name)
    msg = Message(blob.name)
    bus_service.send_queue_message('cocoonaks', msg)



