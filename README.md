# Tution-Management-System

## NPM Scripts

- To start the server `npm start` OR `npm run start`

- Start the Server in Dev mode `npm run start:dev`

## Start Database Instances

````bash
mongod --port=5010 --replSet=tmsreplica --dbpath="data/primary"

mongod --port=5020 --replSet=tmsreplica --dbpath="data/secondary1"

mongod --port=5030 --replSet=tmsreplica --dbpath="data/secondary2"
````

## Initiate Replicaset

````bash
mongosh --port=5010

rs.initiate()

rs.add({host: "localhost:5020"})
rs.add({host: "localhost:5030"})
````