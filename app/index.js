var http = require('http');
var redis = require("redis");
var bluebird = require("bluebird");
const express = require('express')
const app = express();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on("error", function (err) {
  console.error("Error " + err);
  process.exit(1);
});

const VISITOR_CTR_KEY = 'VISITOR_CTR';
const APP_PORT = 8000;
const NOT_READY_PORT = 500;
let appStartTime;
let ready = false;
function getElapsed(startTime, endTime) {
  const timestamps = [startTime,endTime];
  var last = timestamps.pop();
  var durations = [];
  while (timestamps.length) {
      durations.push(last - (last = timestamps.pop()));
  }
  return durations.reverse()[0];
}

function isReady(){
  const currentTime = new Date();
  const elapsedTime = getElapsed(appStartTime,currentTime);
  if(elapsedTime>10000){
    ready = true;
  }
  return ready;
}

app.get('/', async(req, res) => {
  if(!isReady()){
    res.status(NOT_READY_PORT).json({ok:false});
    return
  }
  let count = (await client.getAsync(VISITOR_CTR_KEY)) || 0;
  const ret = await client.setAsync(VISITOR_CTR_KEY, Number(count)+1);
  if(ret === 'OK'){
    res.send("Ola Amigo! You are visitor number:"+count+"\n");
  }
  else{
    res.send(JSON.stringify(ret));
  }
})

app.get('/alive', async(req, res) => {
  res.status(200).json({ok:true});
})

app.get('/ready', async(req, res) => {
  
  if(!isReady()){
    res.status(NOT_READY_PORT).json({ok:false});
    return;
  }
  res.status(200).json({ok:true});
})

app.listen(APP_PORT, () => {
  console.log(`Example app listening on port ${APP_PORT}!`)
  appStartTime = new Date();
})
