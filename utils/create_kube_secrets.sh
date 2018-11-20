
#!/bin/bash

echo "apiVersion: v1
kind: Secret
metadata:
  name: infer
type: Opaque
data:"

for i in SERVICEBUS_NAMESPACE SERVICEBUS_ACCESSKEY_NAME SERVICEBUS_ACCESSKEY STORAGE_ACCOUNT STORAGE_KEY MONGODB 
do 
    tfo=`terraform output $i |tr -d '\n'| base64`
    echo "  $i: $tfo";
done
