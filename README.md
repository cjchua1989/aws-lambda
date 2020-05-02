# AWS Lambda Boiler Plate
This is a boiler plate that you can use for system

# Setup
Install Docker on your local machine

### Docker Installation Ubuntu
(Reference: [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/))
#### SET UP THE REPOSITORY
* Update the apt package index
```shell script
$ sudo apt-get update
```
* Install packages to allow apt to use a repository over HTTPS
```shell script
$ sudo apt-get install \
          apt-transport-https \
          ca-certificates \
          curl \
          gnupg-agent \
          software-properties-common
```
* Add Docker’s official GPG key:
```shell script
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
* Verify that you now have the key with the fingerprint
```shell script
$ sudo apt-key fingerprint 0EBFCD88

pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```
* Use the following command to set up the stable repository
```shell script
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

#### INSTALL DOCKER ENGINE
* Update the apt package index, and install the latest version of Docker Engine and containerd, or go to the next step to install a specific version:
```shell script
 $ sudo apt-get update
 $ sudo apt-get install docker-ce docker-ce-cli containerd.io
```
* To install a specific version of Docker Engine, list the available versions in the repo, then select and install:
* List the versions available in your repo:
```shell script
$ apt-cache madison docker-ce

  docker-ce | 5:18.09.1~3-0~ubuntu-xenial | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 5:18.09.0~3-0~ubuntu-xenial | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.1~ce~3-0~ubuntu       | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages
  docker-ce | 18.06.0~ce~3-0~ubuntu       | https://download.docker.com/linux/ubuntu  xenial/stable amd64 Packages
  ...
```
* Install a specific version using the version string from the second column, for example, ```5:18.09.1~3-0~ubuntu-xenial```.
```shell script
$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io
```
#### MANAGE DOCKER AS A NON-ROOT USER
(Reference: [https://docs.docker.com/engine/install/linux-postinstall/](https://docs.docker.com/engine/install/linux-postinstall/))

* Create the ```docker``` group.
```shell script
$ sudo groupadd docker
```
* Add your user to the ```docker``` group.
```shell script
$ sudo usermod -aG docker $USER
```
* Log out and log back in so that your group membership is re-evaluated.
```shell script
newgrp docker 
```

# Tools

### Start Local Environment
```shell script
./artisan.sh init
```

### Configure Local Environment
```shell script
./artisan.sh configure <KEY> <SECRET>
```

### Start Local Environment
```shell script
./artisan.sh start
```

### Stop Local Environment
```shell script
./artisan.sh stop
```

### Create Migration files
```shell script
./artisan.sh make:migration <table_name>
```

### Run Migration
```shell script
./artisan.sh migrate
```

### Create new Lambda Function
```shell script
./artisan.sh make:event <function_name>
```

### Create new API Lambda Function
```shell script
./artisan.sh make:api <function_name>
```

### Create new CRON Lambda Function
```shell script
./artisan.sh make:cron <function_name>
```

### Create new Repository
```shell script
./artisan.sh make:repository <repository_name>
```

### Create new Service
```shell script
./artisan.sh make:service <service_name>
```

### Run Test
```shell script
./artisan.sh test
```

### Invoke a function without parameter
```shell script
./artisan.sh invoke <function_name>
```

### Invoke a function with parameter
```shell script
./artisan.sh invoke <function_name> <path_to_parameter (e.g events/api/users.json)> 
```

