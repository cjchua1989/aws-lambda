#!/usr/bin/env bash

command=$1

if [ $command == 'init' ]; then

  echo "Initializing Environment...";
  docker-compose build
  cp .env.example .env
  docker-compose run node npm install

elif [ $command == 'configure' ]; then

  key=$2
  secret=$3

  if [ -z $key ] || [ -z $secret ]; then
    echo "Key and Secret is required to configure";
  else
    docker-compose run node serverless config credentials --provider aws --key "$key" --secret "$secret" --profile custom-profile
  fi

elif [ $command == 'start' ]; then

  echo "Starting the environment...";
  docker-compose up -d
  echo "Done starting your environment...";

elif [ $command == 'stop' ]; then

  echo "Stopping the environment...";
  docker-compose down -d
  echo "Done stopping your environment...";

elif [ $command == 'migrate' ]; then
  docker-compose run node node migrations.js up

elif [ $command == 'make:migration' ]; then

    table=$2
    if [ -z $table ]; then
      echo "Table name is required";
    else
      cat > "./migrations/$(date +%s)_$(echo $table)_table.js" <<EOF
'use strict';

const up = "";
const down = "";

module.exports = {
  up,
  down
};
EOF
    fi

elif [ $command == 'make:api' ]; then

    function_name=$2
    if [ -z $function_name ]; then
      echo "Function name is required";
    else

      mkdir "$PWD/src/functions/api/$function_name"

      cat > "$PWD/events/api/$function_name.json" <<EOF
{
    "body": "<JSON STRING>"
}
EOF
      cat > "$PWD/tests/api/$function_name.js" <<EOF
require('dotenv').config();
const { assert, expect } = require('chai');
const { execute } = require('../../src/functions/api/$function_name/handler');

describe('<Test Goal>', async () => {
    it('<Validation Label>', async () => {});
});
EOF

      cat > "$PWD/src/functions/api/$function_name/config.yml" <<EOF
$function_name:
  handler: src/functions/api/$function_name/handler.execute
  events:
    - http:
        path: $function_name
        method: get
        timeout: 300
        cors: true
  environment:
    STAGE: \${self:custom.STAGE}
EOF

      cat > "$PWD/src/functions/api/$function_name/validate.js" <<EOF
const { Schema } = require('validate');
const { ParameterError } = require('../../../libs/errors');

const RULE = new Schema({});

module.exports = (request) => {
    const errors = RULE.validate(request);
    if (errors.length) {
        throw new ParameterError(errors);
    }
};
EOF

      cat > "$PWD/src/functions/api/$function_name/response.js" <<EOF
module.exports.STATUS_200 = {
    code: 200,
    message: '',
};
EOF

      cat > "$PWD/src/functions/api/$function_name/handler.js" <<EOF
// Global
const { API_200, THROW_API_ERROR } = require('../../../libs/responses');

// Local
const RESPONSE = require('./response');
const VALIDATE = require('./validate');

module.exports.execute = async (event) => {
    try {
        VALIDATE(event.body);

        return {
            ...API_200,
            body: JSON.stringify(RESPONSE.STATUS_200),
        };
    } catch (error) {
        return THROW_API_ERROR(error);
    }
};
EOF
  fi

elif [ $command == 'make:event' ]; then

    function_name=$2
    if [ -z $function_name ]; then
      echo "Function name is required";
    else
      mkdir "$PWD/src/functions/events/$function_name"

      cat > "$PWD/events/events/$function_name.json" <<EOF
{
}
EOF
      cat > "$PWD/tests/events/$function_name.js" <<EOF
require('dotenv').config();
const { assert, expect } = require('chai');
const { execute } = require('../../src/functions/events/$function_name/handler');

describe('<Test Goal>', async () => {
    it('<Validation Label>', async () => {});
});
EOF

      cat > "$PWD/src/functions/events/$function_name/config.yml" <<EOF
$function_name:
  handler: src/functions/events/$function_name/handler.execute
  environment:
    STAGE: \${self:custom.STAGE}
EOF

      cat > "$PWD/src/functions/events/$function_name/validate.js" <<EOF
const { Schema } = require('validate');
const { ParameterError } = require('../../../libs/errors');

const RULE = new Schema({});

module.exports = (request) => {
    const errors = RULE.validate(request);
    if (errors.length) {
        throw new ParameterError(errors);
    }
};
EOF

      cat > "$PWD/src/functions/events/$function_name/response.js" <<EOF
module.exports.STATUS_200 = {
    code: 200,
    message: '',
};
EOF

      cat > "$PWD/src/functions/events/$function_name/handler.js" <<EOF
// Global
const { THROW_ERROR } = require('../../../libs/responses');

// Local
const RESPONSE = require('./response');
const VALIDATE = require('./validate');

module.exports.execute = async (event) => {
    try {
        VALIDATE(event);

        return RESPONSE.STATUS_200;
    } catch (error) {
        return THROW_ERROR(error);
    }
};
EOF
  fi

elif [ $command == 'make:cron' ]; then

    function_name=$2
    if [ -z $function_name ]; then
      echo "Function name is required";
    else
      mkdir "$PWD/src/functions/cron/$function_name"

      cat > "$PWD/events/cron/$function_name.json" <<EOF
{
}
EOF
      cat > "$PWD/tests/cron/$function_name.js" <<EOF
require('dotenv').config();
const { assert, expect } = require('chai');
const { execute } = require('../../src/functions/cron/$function_name/handler');

describe('<Test Goal>', async () => {
    it("<Validation Label>", async () => {});
});
EOF

      cat > "$PWD/src/functions/cron/$function_name/config.yml" <<EOF
$function_name:
  handler: src/functions/cron/$function_name/handler.execute
  events:
  - schedule:
      rate: cron(0 0 * * ? *)
      timezone: Asia/Manila
      enabled: true
  environment:
    STAGE: \${self:custom.STAGE}
EOF

      cat > "$PWD/src/functions/cron/$function_name/validate.js" <<EOF
const { Schema } = require('validate');
const { ParameterError } = require('../../../libs/errors');

const RULE = new Schema({});

module.exports = (request) => {
    const errors = RULE.validate(request);
    if (errors.length) {
        throw new ParameterError(errors);
    }
};
EOF

      cat > "$PWD/src/functions/cron/$function_name/response.js" <<EOF
module.exports.STATUS_200 = {
    code: 200,
    message: '',
};
EOF

      cat > "$PWD/src/functions/cron/$function_name/handler.js" <<EOF
// Global
const { THROW_ERROR } = require('../../../libs/responses');

// Local
const RESPONSE = require('./response');
const VALIDATE = require('./validate');

module.exports.execute = async (event) => {
    try {
        VALIDATE(event);

        return RESPONSE.STATUS_200;
    } catch (error) {
        return THROW_ERROR(event);
    }
};
EOF
  fi

elif [ $command == 'make:repository' ]; then

  name=$2

  cat > "$PWD/src/repositories/$(echo $name)Repository.js" <<EOF
const RP = require('./repository');

module.exports = {};
EOF

elif [ $command == 'make:service' ]; then

  name=$2

  cat > "$PWD/src/services/$(echo $name)Service.js" <<EOF
module.exports = {};
EOF

elif [ $command == 'make:model' ]; then

  name=$2

  cat > "$PWD/src/models/$(echo $name)Model.js" <<EOF
const { Sequelize, Model } = require('sequelize');
const { getConnection } = require('../config/databases');

class User extends Model {}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        sequelize: getConnection(),
    }
);

module.exports = User;
EOF

  cat > "$PWD/src/repositories/$(echo $name)Repository.js" <<EOF
const Model = require('../models/$(echo $name)Model');

module.exports = {};
EOF

elif [ $command == 'install' ]; then

  package=$2

  if [ -z $package ]; then
    docker-compose run node npm install
  else
    docker-compose run node npm install $package
  fi
elif [ $command == 'test' ]; then

  docker-compose run node mocha ./tests --recursive

elif [ $command == 'invoke' ]; then

  function=$2
  parameter=$3

  if [ -z "$function" ]; then
    echo "Function name is required"
  elif [ -z "$parameter" ]; then
    echo  "Invoke without parameter"
    docker-compose run node sls invoke local -f $function
  else
    echo  "Invoke with parameter"
    docker-compose run node sls invoke local -f $function -p $parameter
  fi

else
  echo "Sorry you have provided an invalid keyword";
fi