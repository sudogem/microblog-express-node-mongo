#### How to deploy to Bluemix:
Signup Bluemix account here [https://console.ng.bluemix.net/registration]
$ bluemix api https://api.ng.bluemix.net
$ bluemix login -u <IBM ID or email> -o "<ORG>" -s "<SPACE>"
  then you will prompted to enter you password
$ cf help <-- To list all commands
$ cf apps <-- To list all apps
$ cd <APP DIR> e.g $ cd microblog-express-node/
$ cf create-service mysql 100 mysql-db
$ cf push app_name -m 512m

Sample live preview: http://nodeblog-v1.mybluemix.net/#/

#### How to deploy to Openshift 3:
$ oc login https://api.starter-us-west-2.openshift.com
$ oc project microblog-node
$ oc status
