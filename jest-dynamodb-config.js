module.exports = {
  "port": 5001,
  "tables": [
    {
      "TableName": "simpleTableDefinition",
      "KeySchema": [
        {
          "KeyType": "HASH",
          "AttributeName": "identifier"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "identifier",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    },
    {
      "TableName": "simpleTableDefinition2",
      "KeySchema": [
        {
          "KeyType": "HASH",
          "AttributeName": "identifier"
        },
        {
          "KeyType": "RANGE",
          "AttributeName": "sort"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "identifier",
          "AttributeType": "S"
        },
        {
          "AttributeName": "sort",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    },
    {
      "TableName": "complexTableDefinitionQuery",
      "KeySchema": [
        {
          "KeyType": "HASH",
          "AttributeName": "hash"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "hash",
          "AttributeType": "S"
        },
        {
          "AttributeName": "text",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      },
      "GlobalSecondaryIndexes": [
        {
          "IndexName": "abc",
          "KeySchema": [
            {
              "KeyType": "HASH",
              "AttributeName": "text"
            }
          ],
          "ProvisionedThroughput": {
            "ReadCapacityUnits": 1,
            "WriteCapacityUnits": 1
          },
          "Projection": {
            "ProjectionType": "ALL"
          }
        }
      ]
    },
    {
      "TableName": "complexTableDefinition",
      "KeySchema": [
        {
          "KeyType": "HASH",
          "AttributeName": "hash"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "hash",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    },
    {
      "TableName": "deleteTableDefinition",
      "KeySchema": [
        {
          "KeyType": "HASH",
          "AttributeName": "hash"
        }
      ],
      "AttributeDefinitions": [
        {
          "AttributeName": "hash",
          "AttributeType": "S"
        }
      ],
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
      }
    }
  ]
};