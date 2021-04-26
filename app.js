const express = require('express');
const app = express();
//const port = 3000;
const got = require('got');
var fs = require('fs');
const AmbientWeatherApi = require('ambient-weather-api');
var path = require('path');

const api = new AmbientWeatherApi({
  apiKey: '4ef479f3d621421dbe35568f8b636b6e1103c983fc7546f5bde5911c10bc3b9b',
  applicationKey: '49817ae64b4c421f9e7d8b03706230f91e308cc58a2f427f93c939cce20582da'
})

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/garden360', (req, res) => {
  res.render('garden360', {
    title: "EJS example",
    header: "Some users"
    });
  });

app.get('/weatherdata', (req, res) => {
      api.userDevices()
    .then((devices) => {

      devices.forEach((device) => {
        // fetch the most recent data
        api.deviceData(device.macAddress, {
          limit: 1
        })
        .then((deviceData) => {
          console.log(deviceData);
          fs.writeFileSync('./public/weatherdata.json', JSON.stringify(deviceData));
          
          //console.log('The 5 most recent temperature reports for ' + device.info.name + ' - ' + device.info.location + ':')
          // deviceData.forEach((data) => {
          //   //console.log(data.date + ' - ' + data.tempf + '°F')
          // })
          console.log('---')
        })
      })
    })
});  

app.get('/getdata', (req, res) => {
    
    (async () => {
        try {
            const response = await got('https://api.vegecloud.com/out/34315633/R52ZXG22RFPCLZFU?order=desc&limit=5').json();
            console.log(response);
            fs.writeFileSync('./public/lastentry.json', JSON.stringify(response));


            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();

  })

  app.get('/saveJson', (req,res) => {
    var person = {
        name: 'name',
        age: 'age'
      }; 
    //fs.writeFile('./public/lastentry.json', JSON.stringify(person));
    fs.writeFileSync('./public/lastentry.json', JSON.stringify(person));
  });

  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8000;
  }
  app.listen(port);
  //app.listen(process.env.PORT);
 

function intervalFunc() {
    var d = new Date();
    var n = d.toString();
    console.log(n);
    (async () => {
        try {
            const response = await got('https://api.vegecloud.com/out/34315633/R52ZXG22RFPCLZFU?order=desc&limit=5').json();
            console.log(response);
            fs.writeFileSync('./public/lastentry.json', JSON.stringify(response));


            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();
    
  }

  function intervalFuncWeather() {
    api.userDevices()
    .then((devices) => {

      devices.forEach((device) => {
        // fetch the most recent data
        api.deviceData(device.macAddress, {
          limit: 1
        })
        .then((deviceData) => {
          console.log(deviceData);
          fs.writeFileSync('./public/weatherdata.json', JSON.stringify(deviceData));
          
          //console.log('The 5 most recent temperature reports for ' + device.info.name + ' - ' + device.info.location + ':')
          // deviceData.forEach((data) => {
          //   //console.log(data.date + ' - ' + data.tempf + '°F')
          // })
          console.log('---')
        })
      })
    })
    
  }
  
setInterval(intervalFunc, 900000);
setInterval(intervalFuncWeather, 900000);

  