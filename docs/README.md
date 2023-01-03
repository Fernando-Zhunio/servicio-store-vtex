# Service Stores

It is a node and masterdata application to store the company stores.

<!-- ![Service Example Architecture](https://user-images.githubusercontent.com/18706156/77381360-72489680-6d5c-11ea-9da8-f4f03b6c5f4c.jpg) -->

## API Routes

- GET method, path /shops

### Scheme:

```json
{
  "data": {
    "city": "string",
    "company": "string",
    "stores": {
      "id": "string",
      "name": "string",
      "schedules": "string",
      "address": "string",
      "latitude": "string",
      "longitude": "string",
      "status": "boolean"
    }[]
  }[]
}
```

- GET method, path /shop/:id

This method searches for id {account name - city} and returns the data of a single city with its respective stores

### Scheme:

```json
{

  "city": "string",
  "company": "string",
  "stores": {
    "id": "string",
    "name": "string",
    "schedules": "string",
    "address": "string",
    "latitude": "string",
    "longitude": "string",
    "status": "boolean"
  }[]
}
```

- POST method, path /shops

This method creates or updates the information of a store

### Request Body:

```json
{
  "store":{
     "id": "001",
     "name": "test store",
     "schedules": [
       {
         "dayOfWeek": "0",
         "openingTime": "10:00",
         "closingTime": "20:00"
       },
       {
         "dayOfWeek": "1",
         "openingTime": "10:00",
         "closingTime": "20:00"
       },
       {
         "dayOfWeek": "2",
         "openingTime": "10:00",
         "closingTime": "20:00",
       }
     ],
     "address": "test address",
     "latitude": "test latitude",
     "longitude": "test length",
     "status": true,
  }, 
  "city": "guayaquil"
   }
```
