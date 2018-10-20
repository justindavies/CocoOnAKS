
# import keras
import keras

# import keras_retinanet
from keras_retinanet import models
from keras_retinanet.utils.image import read_image_bgr, preprocess_image, resize_image
from keras_retinanet.utils.visualization import draw_box, draw_caption
from keras_retinanet.utils.colors import label_color
from PIL import Image


import os
import numpy as np
import pymongo
from pymongo import MongoClient
import datetime
import socket

from azure.servicebus import ServiceBusService, Message, Queue
from azure.storage.blob import BlockBlobService, PublicAccess


# set tf backend to allow memory to grow, instead of claiming everything
import tensorflow as tf

if os.environ.get("MONGODB") is None:
    client = MongoClient('mongodb://localhost:27017/')
else:
    client = MongoClient(os.environ["MONGODB"])

db = client.cocoonaks

# Get Collections
agents = db.agents
inferences = db.inferences

alive = {"host": socket.gethostname(), "date": datetime.datetime.utcnow()}

agents.insert_one({"host": socket.gethostname(), "date": datetime.datetime.utcnow()})

bus_service = ServiceBusService(
    service_namespace=os.environ['SERVICEBUS_NAMESPACE'],
    shared_access_key_name=os.environ['SERVICEBUS_ACCESSKEY_NAME'],
    shared_access_key_value=os.environ['SERVICEBUS_ACCESSKEY'])


block_blob_service = BlockBlobService(account_name=os.environ['STORAGE_ACCOUNT'], account_key=os.environ['STORAGE_KEY'])


# One Shot
# bus_service.create_queue('CoCoOnAKS')

def get_session():
    config = tf.ConfigProto()
    config.gpu_options.allow_growth = True
    return tf.Session(config=config)

# use this environment flag to change which GPU to use
#os.environ["CUDA_VISIBLE_DEVICES"] = "1"

# set the modified tf session as backend in keras
keras.backend.tensorflow_backend.set_session(get_session())

# adjust this to point to your downloaded/trained model
# models can be downloaded here: https://github.com/fizyr/keras-retinanet/releases
model_path = os.path.join('model', 'resnet50_coco_best_v2.1.0.h5')

# load retinanet model
model = models.load_model(model_path, backbone_name='resnet50')

# if the model is not converted to an inference model, use the line below
# see: https://github.com/fizyr/keras-retinanet#converting-a-training-model-to-inference-model
#model = models.load_model(model_path, backbone_name='resnet50', convert=True)

#print(model.summary())

# load label to names mapping for visualization purposes
labels_to_names = {0:"person",1:"bicycle",2:"car",3:"motorcycle",4:"airplane",5:"bus",6:"train",7:"truck",8:"boat",9:"traffic light",10:"fire hydrant",11:"street sign",12:"stop sign",13:"parking meter",14:"bench",15:"bird",16:"cat",17:"dog",18:"horse",19:"sheep",20:"cow",21:"elephant",22:"bear",23:"zebra",24:"giraffe",25:"hat",26:"backpack",27:"umbrella",28:"shoe",29:"eye glasses",30:"handbag",31:"tie",32:"suitcase",33:"frisbee",34:"skis",35:"snowboard",36:"sports ball",37:"kite",38:"baseball bat",39:"baseball glove",40:"skateboard",41:"surfboard",42:"tennis racket",43:"bottle",44:"plate",45:"wine glass",46:"cup",47:"fork",48:"knife",49:"spoon",50:"bowl",51:"banana",52:"apple",53:"sandwich",54:"orange",55:"broccoli",56:"carrot",57:"hot dog",58:"pizza",59:"donut",60:"cake",61:"chair",62:"couch",63:"potted plant",64:"bed",65:"mirror",66:"dining table",67:"window",68:"desk",69:"toilet",70:"door",71:"tv",72:"laptop",73:"mouse",74:"remote",75:"keyboard",76:"cell phone",77:"microwave",78:"oven",79:"toaster",80:"sink",81:"refrigerator",82:"blender",83:"book",84:"clock",85:"vase",86:"scissors",87:"teddy bear",88:"hair drier",89:"toothbrush",90:"hair brush",91:"banner",92:"blanket",93:"branch",94:"bridge",95:"building-other",96:"bush",97:"cabinet",98:"cage",99:"cardboard",100:"carpet",101:"ceiling-other",102:"ceiling-tile",103:"cloth",104:"clothes",105:"clouds",106:"counter",107:"cupboard",108:"curtain",109:"desk-stuff",110:"dirt",111:"door-stuff",112:"fence",113:"floor-marble",114:"floor-other",115:"floor-stone",116:"floor-tile",117:"floor-wood",118:"flower",119:"fog",120:"food-other",121:"fruit",122:"furniture-other",123:"grass",124:"gravel",125:"ground-other",126:"hill",127:"house",128:"leaves",129:"light",130:"mat",131:"metal",132:"mirror-stuff",133:"moss",134:"mountain",135:"mud",136:"napkin",137:"net",138:"paper",139:"pavement",140:"pillow",141:"plant-other",142:"plastic",143:"platform",144:"playingfield",145:"railing",146:"railroad",147:"river",148:"road",149:"rock",150:"roof",151:"rug",152:"salad",153:"sand",154:"sea",155:"shelf",156:"sky-other",157:"skyscraper",158:"snow",159:"solid-other",160:"stairs",161:"stone",162:"straw",163:"structural-other",164:"table",165:"tent",166:"textile-other",167:"towel",168:"tree",169:"vegetable",170:"wall-brick",171:"wall-concrete",172:"wall-other",173:"wall-panel",174:"wall-stone",175:"wall-tile",176:"wall-wood",177:"water-other",178:"waterdrops",179:"window-blind",180:"window-other",181:"wood"}

print("Connecting to Queue...")
while True:
    msg = bus_service.receive_queue_message('cocoonaks', peek_lock=False)
    if (msg.body is not None):
        try:
            print("Popped " + msg.body)
            # load image
            block_blob_service.get_blob_to_path("images", msg.body, msg.body)

            image = read_image_bgr(msg.body)
            os.remove(msg.body)

            # preprocess image for network
            image = preprocess_image(image)
            image, scale = resize_image(image)



            # process image
            boxes, scores, labels = model.predict_on_batch(np.expand_dims(image, axis=0))

            # correct for image scale

            # visualize detections
            results = []

            for box, score, label in zip(boxes[0], scores[0], labels[0]):
                # scores are sorted so we can break
                if score < 0.5:
                    break
                    
                results.append(labels_to_names[label])
            
            inferences.insert_one({"image": msg.body, "results": list(set(results)), "date": datetime.datetime.utcnow()})

        except Exception as e:
            print("Oops - " + str(e))
            continue  # or you could use 'continue'

        

