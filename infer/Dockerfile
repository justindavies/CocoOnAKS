FROM python:2
COPY infer.py /
RUN mkdir /model
COPY model/* /model
RUN git clone https://github.com/fizyr/keras-retinanet.git
WORKDIR /keras-retinanet
RUN pip install numpy 
RUN pip install . 
COPY requirements.txt /
WORKDIR /
RUN pip install -r requirements.txt
CMD ["python", "/infer.py"]

