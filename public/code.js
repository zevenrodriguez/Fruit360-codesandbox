
AFRAME.registerComponent('currentpatch', {
    schema: {
      patch: {default: -1}
    },

      init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        var curText = document.querySelectorAll('.panelText');
        var currentPanel = document.querySelector(".showpanel");
        var outputText = {"Patch" : "0", "Soil Temp" : "0", "Soil Moisture" : "0", "Light Intensity" : "0", "Battery" : "0"};

        el.addEventListener('mouseenter', function () {
          console.log(data.patch);
          currentPanel.setAttribute('visible', 'true');
          //console.log(curText);
          //var thetext = "testing";
          //curText[0].setAttribute("value", thetext);
          loadJSON(function(response) {
            // Parsing JSON string into object
            var actual_JSON = JSON.parse(response);
              console.log(actual_JSON);

            for(obj in actual_JSON){
              //console.log(obj);
              if(actual_JSON[obj]["ch"] == "4"){
                //Humidity
                outputText["Light Intensity"] = actual_JSON[obj]["v"]
              }else if(actual_JSON[obj]["ch"] == "2"){
                //Soil Moisture
                outputText["Soil Moisture"] = actual_JSON[obj]["v"]
              }else if(actual_JSON[obj]["ch"] == "3"){
                //Soil Temp
                outputText["Soil Temp"] = actual_JSON[obj]["v"]
              }else if(actual_JSON[obj]["ch"] == "5"){
                //Battery
                outputText["Battery"] = actual_JSON[obj]["v"]
              }
            }
          
            for (let x in outputText) {
              console.log(x + ": "+ outputText[x]);
              if(x == "Patch"){
                var randomVegi = ["Carrots", "Cilantro", "Parsley", "Bok Choy","Kale","Spinach","Micro Greens"];
                var randnumber = Math.floor(Math.random() * randomVegi.length);
                if(randnumber == 0){
                  outputText[x] = data.patch + " " + randomVegi[randnumber] + " are ready for harvest!";
                }else{
                  outputText[x] = data.patch + " " + randomVegi[randnumber] + " will be ready in " + randnumber + " weeks!";
                }
                curText[0].setAttribute("value", x + " " + outputText[x]);
              }else if(x == "Soil Temp"){
                curText[1].setAttribute("value", x + " : " + outputText[x]);
              }else if(x == "Soil Moisture"){
                curText[2].setAttribute("value", x + " : " + outputText[x]);
              }else if(x == "Light Intensity"){
                curText[3].setAttribute("value", x + " : " + outputText[x]);
              }else if(x == "Battery"){
                curText[4].setAttribute("value", x + " : " + outputText[x]);
              }
            }
          
           });
        });

        el.addEventListener('mouseleave', function () {
          currentPanel.setAttribute('visible', 'false');
        });
      },
      update: function(){
       
      }
    });

    function loadJSON(callback) {   

      var xobj = new XMLHttpRequest();
          xobj.overrideMimeType("application/json");
      xobj.open('GET', 'lastentry.json', true); // Replace 'appDataServices' with the path to your file
      xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
              // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
              callback(xobj.responseText);
            }
      };
      xobj.send(null);  
   }

  
   var running = false;
   var counting = 0;
   var waterclassfound = false;


   AFRAME.registerComponent('waterrunning', {
    schema: {
      isrunning: {default: false}
    },

      init: function () {
        var el = this.el;  // <a-box>
        this.waterflow = document.querySelector(".waterlabel");

       
        el.addEventListener('click', function () {
          console.log("water on");

          if(running == false){
            running = true;
          }else{
            running = false;
          }

        });
      },
      tick: function(time, timeDelta){

        if(running == true){
          var waterflow = this.waterflow;

          counting++;
          console.log("water is running " + counting);
          waterflow.setAttribute("value", counting);


        }
      }
    });

    function loadWeather(callback) {   

      var xobj = new XMLHttpRequest();
          xobj.overrideMimeType("application/json");
      xobj.open('GET', 'weatherdata.json', true); // Replace 'appDataServices' with the path to your file
      xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
              // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
              callback(xobj.responseText);
            }
      };
      xobj.send(null);  
   }


    AFRAME.registerComponent('weather', {
      schema: {
        patch: {default: -1}
      },
  
        init: function () {
          var data = this.data;
          var el = this.el;  // <a-box>
          var currentWPanel = document.querySelector(".weatherpanel");

          var weatherWanted = ['tempf','battout','humidity','winddir','windspeedmph','dailyrainin','solarradiation','uv'];


          for(var i = 0; i < weatherWanted.length; i++){
              let newElement = document.createElement('a-gui-label'); 
              newElement.setAttribute("width","2");
              newElement.setAttribute("height","0.25");
              newElement.setAttribute("margin","0 0 0.05 0");
              newElement.setAttribute("font-color","white");
              newElement.setAttribute("opacity","0.0");
              newElement.setAttribute("background-color","black");
              newElement.setAttribute("class","weatherEntry");

              currentWPanel.appendChild(newElement);
          }

  
          el.addEventListener('mouseenter', function () {
            var weatherLabels = document.querySelectorAll('.weatherEntry');

            loadWeather(function(response) {
              // Parsing JSON string into object
              var actual_JSON = JSON.parse(response);
                console.log(actual_JSON);
                var label = '';
                var count = 0;
                for(obj in actual_JSON[0]){
                  for(w in weatherWanted){
                    console.log(w);
                    if(weatherWanted[w] == obj){
                      console.log(obj + " " + actual_JSON[0][obj]);
                      var curWL = obj + " " + actual_JSON[0][obj];
                      weatherLabels[count].setAttribute("value",curWL);
                      count++;
                    }
                  }
                }
               
                currentWPanel.setAttribute('visible', 'true');

             });
          });
  
          el.addEventListener('mouseleave', function () {
            currentWPanel.setAttribute('visible', 'false');
          });
        },
        update: function(){
         
        }
      });


      /*
dateutc code.js:176:27
tempinf code.js:176:27
humidityin code.js:176:27
baromrelin code.js:176:27
baromabsin code.js:176:27
tempf code.js:176:27
battout code.js:176:27
humidity code.js:176:27
winddir code.js:176:27
windspeedmph code.js:176:27
windgustmph code.js:176:27
maxdailygust code.js:176:27
hourlyrainin code.js:176:27
eventrainin code.js:176:27
dailyrainin code.js:176:27
weeklyrainin code.js:176:27
monthlyrainin code.js:176:27
totalrainin code.js:176:27
solarradiation code.js:176:27
uv code.js:176:27
batt_co2 code.js:176:27
feelsLike code.js:176:27
dewPoint code.js:176:27
feelsLikein code.js:176:27
dewPointin code.js:176:27
loc code.js:176:27
date
*/


    

