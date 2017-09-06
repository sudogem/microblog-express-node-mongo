#### How to deploy to Bluemix:
Signup Bluemix account [here](https://console.ng.bluemix.net/registration).   
$ bluemix api https://api.ng.bluemix.net   
$ bluemix login -u <IBM ID or email> -o "<ORG>" -s "<SPACE>"   
  then you will prompted to enter you password   
$ cf help <-- To list all commands   
$ cf apps <-- To list all apps   
$ cd <APP DIR> e.g $ cd microblog-express-node/   
$ cf create-service mysql 100 mysql-db   
$ cf push app_name -m 512m   

Sample live preview: http://nodeblog-v1.mybluemix.net/#/

#### How to deploy to Openshift v3:
$ oc login https://api.starter-us-west-2.openshift.com   
$ oc project microblog-node   
$ oc status -v <-- to check the status   

(Manual deploy) From the root of your app you execute this command:   
$ oc start-build nodejs-mongo-persistent -n microblog-node   
$ oc status -v   

#### Update the ff. environment variables in OpenShift v3 accordingly
* BASEURL\_API\_PROD
* BASEURL\_API\_DEV
* MONGODB\_URL\_DEV
* MONGODB\_URL\_PROD
* USER\_SALT\_KEY
* JWT\_TOKEN\_SECRET
