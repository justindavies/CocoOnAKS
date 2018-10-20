from azure.servicebus import ServiceBusService, Message, Queue
import os
import glob
from azure.storage.blob import BlockBlobService, PublicAccess
from PIL import Image


bus_service = ServiceBusService(
    service_namespace=os.environ['SERVICEBUS_NAMESPACE'],
    shared_access_key_name=os.environ['SERVICEBUS_ACCESSKEY_NAME'],
    shared_access_key_value=os.environ['SERVICEBUS_ACCESSKEY'])


block_blob_service = BlockBlobService(account_name=os.environ['STORAGE_ACCOUNT'], account_key=os.environ['STORAGE_KEY'])

container_name ='images'
block_blob_service.create_container(container_name)


generator = block_blob_service.list_blobs(container_name)
for blob in generator:
    if (block_blob_service.exists("thumbs", blob.name) == False):
        print("Resizing: " + blob.name)
        block_blob_service.get_blob_to_path("images", blob.name, blob.name)
        size = 150, 150
        im = Image.open(blob.name)
        im.thumbnail(size)
        im.save(blob.name, "JPEG")
        block_blob_service.create_blob_from_path("thumbs", blob.name, blob.name)
        os.remove(blob.name)
