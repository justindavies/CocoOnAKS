import os
import numpy as np
import pymongo
from pymongo import MongoClient
import datetime
import socket

from azure.servicebus import ServiceBusService, Message, Queue
from azure.storage.blob import BlockBlobService, PublicAccess


bus_service = ServiceBusService(
    service_namespace=os.environ['SERVICEBUS_NAMESPACE'],
    shared_access_key_name=os.environ['SERVICEBUS_ACCESSKEY_NAME'],
    shared_access_key_value=os.environ['SERVICEBUS_ACCESSKEY'])

print("Connecting to Queue...")
while True:
    msg = bus_service.receive_queue_message('cocoonaks', peek_lock=False)
    print(msg.body)
