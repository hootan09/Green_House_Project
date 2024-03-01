const express = require('express')
// const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(app.router)
// app.use(express.static(path.join(__dirname, 'public')))



app.get('/metrics', async (req, res) => {
  const metrics = await prisma.metric.findMany({
    // where: { published: true },
    // include: { author: true },
  })
  res.json(metrics)
})

app.post('/metric', async (req, res) => {
  const { humidity, temprature, moisture } = req.body
  const newData = await prisma.metric.create({
    data: {
      humidity,
      temprature,
      moisture
    },
  })
  res.json(newData)
})

// app.put('/metric/:id', async (req, res) => {
//   const { id } = req.params
//   const metric = await prisma.metric.update({
//     where: { id },
//     // data: { published: true },
//   })
//   res.json(metric)
// })

app.delete('/metric/:id', async (req, res) => {
  const { id } = req.params
  const deleteData = await prisma.metric.delete({
    where: {
      id,
    },
  })
  res.json(deleteData)
})

app.get('/downloaddb', function(req, res){
  const file = `${__dirname}/prisma/dev.db`;
  res.download(file); // Set disposition and send it.
});

app.get('/metric/:id', async (req, res) => {
  try {
    const { id } = req.params
    let metric = {};
    if(id == -1){
      metric = await prisma.metric.findMany({
        orderBy: {
          id: 'desc',
        },
        take: 1
      })
    }else{
      metric = await prisma.metric.findMany({
        where: {
          id: +id,
        }
      })
    }
    res.json(metric)
  } catch (error) {
    console.log(error);
    res.json({});
  }
})

const server = app.listen(app.get('port'), ()=> {
  console.log('listening on port', app.get('port'));
})

// unhandled rejections
process.on('unhandledRejection', async(err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  await prisma.$disconnect()
  server.close();
  process.exit(1);
});

//--------------------------------MQTT SECTION ------------------------------
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.1.50");
client.on("connect", () => {
  client.subscribe("metric", (err) => {
    if (!err) {
      // client.publish("presence", "Hello mqtt");
      console.log('Successfuly subscribe to metric topic pub/sub');
    }
  });
});

client.on("message", async(topic, message) => {
  // message is Buffer
  let {humidity,temprature,moisture} = JSON.parse(message.toString());
  console.log(topic,JSON.parse(message.toString()));
  await prisma.metric.create({
    data: {
      humidity: humidity || 0,
      temprature: temprature || 0,
      moisture: moisture || 0,
    },
  });
  // client.end();
});