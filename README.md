# shift-claims-ingester-api
API for customers to claims submission and acknowledgement.

This service exposes http/1.0 REST API and will be behind gateway which will load balance and authorize incoming requests.

### Feature : getClaim
    [1] Check Global Cache Store by Unique ID : FOR_FUTURE -> wrap it under singleflight duplication avoidance
    [2] If not in global cache store , request for enrichment via gRPC to Enrichment MicroService with ACK.
    [3] Respond with 200 OK data or 400 as per enrichment request

### Feature : saveClaims
    [1] Check duplication operation for request_id in Global Cache Store and setup mutex
    [2] If number of claims is less than maxBatchConcurrency, 
        [2.1] Check each claim for existence in gRPC enrichmentService by Unique ID
        [2.2] If not existent then gRPC enrichmentService will persist the data and enrich Global Cache Store
    [3] If number of claims is more  than maxBatchConcurrency,
        [3.1] Push claim in batch to processing AMQP queue for persistence in Fire & Forget mode
    [4] Mark Error responses for duplicate Unique ID for case [2]
    [5] Respond with success along with failed Duplicate Unique ID scenarios

### Feature : healthCheck
    [1] Get Ping for HealthCheck
    [2] Aggregate health from Global Cache Store, Enrichment Service gRPC , AMQP connection 
    [3] Respond with aggregated data

## Setup ENV
```URI={GRPC_SERVER_URI}```
default 127.0.0.1:50051

```REDIS_URI={REDIS_HOST_URI}``` 
default 'redis://:92bmwmvtwma7hpdb3tjzgbdcntfkmmgz@swift-hemlock-0772066f5b.redisgreen.net:11042/'

```DATA_API_KEY={DATA_API_KEY}``` 
default '8wv2geCjMXCAKAmL9vUSoaiXDOVZ2t2mz5EZHRhUPVxnUH9jo1gyRtR4yFAQV2DD'


## Starting the application
```
npm i
npm run start
```

Expected Output :
```
# npm run start   
> shift-claims-ingester-api@v1.0.0 start
> node --trace-deprecation ./bin/server
```

## Swagger Documentation

http://localhost:3000/documentation
Path : swagger/swagger.json

## Debugging the application
npm run debug

## Test : Jest
```
> npm test
```

## Coverage : Jest
```
> npm run coverage
```

## Dev Credentials

RMQ : CloudAMQP
```
chinook.rmq.cloudamqp.com (Load balanced) 
chinook-01.rmq.cloudamqp.com

UserName: jdksxkpr
Password: dH7lvZjqGt-6XEahnupT88S3WzRgzyns
```

REDIS : RedisGreen Cloud 
```
redis-cli -h swift-hemlock-0772066f5b.redisgreen.net -p 11042 -a 92bmwmvtwma7hpdb3tjzgbdcntfkmmgz
```
<img width="712" alt="coverage" src="https://user-images.githubusercontent.com/16558135/166189465-82d0c76d-6b84-468f-bba5-643aa43267e0.png">


