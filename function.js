graphlinkegrenze = 12
graphbreiteinviertelstunden = 48//(28-graphlinkegrenze)*4
incident_toggle =true

overridedisplay9 = false
overridereport = false
overrideleadership = false
parking_list ={geo:[],tooltip:[],usage:[]}
fenster = {hoehe:window.innerHeight-30,breite:window.innerWidth-35};
existing_markers=[]
realtime = true // diese variabel zeig ob wir grade ein zeit ausgewählt haben oder in realzeit anzeigen
isZooming = false
swipes_arr =[]
eventmarkertoggle = false
locked = true
currentTimestamp = new Date()
set_area=0
settim = new Date()
swipemode = false
set_name ="wrong reporter"
eigensymbole_arr =[]
set_pos=[9,9]
eventloc = [0,0]
farbskala = ["lightblue","#00B0F0","#00B0F0","#92D050","#92D050","#FFFF00","#FFFF00","#FF9201","#FF9201","#FF0000",'red',"#ee00ff","#ee00ff","#ee00ff","#ee00ff","#ee00ff"
]
camcountarr ={x:[],y:[]}
parking_arr =[]
count_data=[[0]]





const params = new URLSearchParams(window.location.search);
 namedesevents_short = params.get('event');

 if(!namedesevents_short){alert("No active Event selected.")}

function round5min(time){
const msInFiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  const roundedTime = Math.round(time / msInFiveMinutes) * msInFiveMinutes;
  
return roundedTime
}

function read_a_day(jahr,tager){


ref = database.ref(namedesevents_short+'/day'+tager);
ref.on('value', (snapshot) => {
daydata = snapshot.val()


// hier wurde daydata gelesen und wird jetzt in graphdate convertiert


graphdata = {x:[]}
tabellen_data ={}
capa_array={}
// für jede satge werde 
for(i=0;i<stages_list.length;i++){graphdata[stages_list[i].name] = Array(288).fill('x')
  graphdata[stages_list[i].name][0]=0
  graphdata[stages_list[i].name][287]=0
capa_array[[stages_list[i].name]] =stages_list[i].capacity
tabellen_data[stages_list[i].name] = Array(288).fill('x')
tabellen_data[stages_list[i].name][0]=[0,0,0,0]
  tabellen_data[stages_list[i].name][287]=[0,0,0,0]
}

for( i = 0;i<(24*60);i += (5)){
 let temp = (start_graphdata+(i*60000))
  graphdata.x.push(new Date(temp+(60*60*1000*zeitshift)))
}

for (const key in daydata){

 cap = capa_array[key]
  for(o=0;o<daydata[key].usage.length;o++){
    timeslot = daydata[key].zeit[o] - start_graphdata 
    timeslot = Math.round(timeslot/(60*1000*5))
  
    graphdata[key][timeslot] = cap*daydata[key].usage[o]/100
   
    tabellen_data[key][timeslot] = [daydata[key].usage[o],daydata[key].density[o],daydata[key].tension[o] ,(cap* daydata[key].usage[o]/100)]
  }
}

for (key in graphdata)
{
for (i=0;i<288;i++){
    if(key != "x" && tabellen_data[key][i] == 'x'){tabellen_data[key][i] = tabellen_data[key][i-1] }

if(graphdata[key][i] == 'x'){graphdata[key][i] = graphdata[key][i-1] }

}}

if(mode=="cmd"){
  currentlocaltime = new Date().getTime()+(60*60*1000*zeitshift)  
  balad_plot_malen(graphdata)  }


})
}
function draw_arrow(){
if(!mapbox){  movement_layer.clearLayers()  
if(realtime == true){drawjetzt = new Date().getTime();puffer =0}
else{drawjetzt=settim;puffer = (1000*60*7)}
  

    for (let lil=0;lil < swipes_arr.length;lil++){
              if(swipes_arr[lil].endzeit+puffer > drawjetzt && swipes_arr[lil].zeit-puffer < drawjetzt)
                              {

                              let ttl = (swipes_arr[lil].endzeit - drawjetzt)

                        farbe = "green"
                        if (swipes_arr[lil].dicke>5){farbe = "lime"}
                        if (swipes_arr[lil].dicke>10){farbe = "red"}
                        if(swipes_arr[lil].meldender == "sandro"){farbe="black"; swipes_arr[lil].dicke=10}

                        var polyline = L.polyline([swipes_arr[lil].von,swipes_arr[lil].nach],{weight:swipes_arr[lil].dicke,color:farbe}).bindTooltip(swipes_arr[lil].meldender + " - " +  getTimeOfDay (swipes_arr[lil].zeit)).addTo(movement_layer);
                      //  polyline.openTooltip()
                        var arrowHead = L.polylineDecorator(polyline, {    patterns: [   
                          { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ 
                          pixelSize: swipes_arr[lil].dicke+5, polygon: false, 
                          pathOptions: { fillOpacity: 1, weight:swipes_arr[lil].dicke,color:farbe } }) }    ]}).addTo(movement_layer);
                        setTimeout(function(){
                        polyline.remove()
                        arrowHead.remove()
                   
                        },ttl*1000)

                        polyline.on("click",function(){     swipes_arr[lil].endzeit = drawjetzt
                          polyline.remove()
                          arrowHead.remove()
                          databaseRef =database.ref(namedesevents_short+'/aux/day' + heutag + '/swipes')
         databaseRef.set(swipes_arr)})
                      
                      }
              }
}
}
function initialise_firebase(){
  if (mode == "cmd"){d3.select("title").text(namedesevents_short + " - crowdreport")}
  if (mode == "csa") {d3.select("title").text(namedesevents_short + " - CSA")  }
    
const firebaseConfig = {
apiKey: "AIzaSyBOOdW1SHCwBZSchUJ7DfJZ1a7-dEYTvuQ",
authDomain: "crowdcount-678c8.firebaseapp.com",
databaseURL: "https://crowdcount-678c8-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "crowdcount-678c8",
storageBucket: "crowdcount-678c8.appspot.com",
messagingSenderId: "1020533758948",
appId: "1:1020533758948:web:23ec6e175dff3b5eedc5f1",
measurementId: "G-00674BETEZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
database = firebase.database();
deviceversion = 3.3

databaseRef = database.ref(namedesevents_short+'/geometry');
    databaseRef.once('value')
    .then(snapshot => {
        // Process the snapshot data here
         stages_list=  snapshot.val().stage;
         blocking_arr = snapshot.val().block;
         restrooms=snapshot.val().restrooms
      fluchtrouten=snapshot.val().egress
         medstations = snapshot.val().medical
          totalCapacity = stages_list.reduce((sum, stage) => {
          if (stage.hide) return sum; // skip hidden stages
          return sum + (stage.capacity || 0);
        }, 0);

   
        if (mapbox){initialise_mapboxmap()}else{
        initialise_map()
}
        if (mode =="cmd") {initialise_settings()}
         })

         
databaseRef = database.ref(namedesevents_short+'/eventsettings');
// Read the data once
databaseRef.once('value')
    .then(snapshot => {
      console.log("Settings gelesen ")
        // Process the snapshot data here
        eventsettings = snapshot.val();

     if(overridedisplay9==false && deviceversion != eventsettings.version){alert("You are using an old version("+deviceversion+") of the crowdreport app. the current version is "+eventsettings.version+". please reload the site!")}              
    if(eventsettings.cad)  {imageUrl ="./cad/"+eventsettings.cad}else{imageUrl =""}

      if(!mapbox) { imageOverlay = L.imageOverlay(imageUrl, eventsettings.imagebounds, { opacity: 1 })
        imageOverlay2 = L.imageOverlay(imageUrl, eventsettings.imagebounds, { opacity: 0.5 }).addTo(mymap);
        layercontrol = L.control.layers(
          {"CAD": imageOverlay,"CAD 50%": imageOverlay2,"Dark":Jawg_Matrix ,"Light": tl1,"Sat-1":mapboxLayer,"Sat-2": sat45,"Sat-3":Esri_WorldImagery },
          {"Stages":stages_layer,"Blocks":green_layer,"CSA":eigensymbole_layer,"Crowdflow" :movement_layer,
        "Medical":aidstations_layer,"Emergency routes":flucht_layer,"CAD 50%": imageOverlay2}).addTo(mymap);
        
        mymap.setView(eventsettings.setview.center,eventsettings.setview.zoom)}
        else{
          map.setCenter(eventsettings.setview.center)


    map.setZoom(eventsettings.setview.zoom)
          //mapboxverison
          /*
          map.on('load', () => {
            map.addSource('svg-overlay', {
              type: 'image',
              url: imageUrl,
              coordinates: [
                [eventsettings.imagebounds[0][1], eventsettings.imagebounds[1][0]], // top-left: [west, north]
                [eventsettings.imagebounds[1][1], eventsettings.imagebounds[1][0]], // top-right: [east, north]
                [eventsettings.imagebounds[1][1], eventsettings.imagebounds[0][0]], // bottom-right: [east, south]
                [eventsettings.imagebounds[0][1], eventsettings.imagebounds[0][0]]  // bottom-left: [west, south]
              ]
            });
          
            map.addLayer({
              id: 'svg-layer',
              type: 'raster',
              source: 'svg-overlay',
              paint: {}
            });
          });
          */
        }
        eventsettings.zeitzone = 3
        jetzt = new Date()// + eventsettings.zeitzone
        nutzerzeitzone =   jetzt.getTimezoneOffset()/-60
        zeitshift = (eventsettings.zeitzone - nutzerzeitzone) //*60*1000
        jetzt = jetzt.getTime()


        if(jetzt < new Date(eventsettings.zeitfenster[0][0]).getTime()-(3*60*60*1000))
          {heutag = 99;
            start_graphdata = new Date()
            temp = 0 
            if(start_graphdata.getHours()<12){temp = (24*60*60*1000)}
            start_graphdata.setHours(12,0,0,0)

            start_graphdata=start_graphdata.getTime()-temp
          }
        else
          {heutag = 1
            
//            if(jetzt > new Date(eventsettings.zeitfenster[0][1]).getTime())
  //          {heutag = 2}

            start_graphdata = new Date(eventsettings.zeitfenster[heutag-1][0]).getTime()
        
          }
       
        
        console.log("heuttag: "+ heutag)
      
        if (mode != "map"){read_current()
           read_a_day(25,heutag)
        }
       
      
namedesevents_long = eventsettings.namelong
      })

    
  
 //        if(mode=="cmd"){ refresh()}
}  

function read_current (){
// ich glaube diese funktion wird nur einmal aufgerufen weil connections zu firebas dann automatisch upgedatet werden

database = firebase.database();

// reading swipes:
      databaseRef = database.ref(namedesevents_short + '/aux/day' + heutag + '/swipes');
      // Listen for changes in the database
      databaseRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
      swipes_arr = snapshot.val();
      draw_arrow()
      } else {
      console.log("No swipe-data available");
      }
    }); 


    databaseRef = database.ref(namedesevents_short + '/aux/day' + heutag + '/incounts');
    // Listen for changes in the database
    databaseRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
    camcountarr = snapshot.val();
  
    } else {
    console.log("No in-data available");
    }
  }); 


// reading own locations
              databaseRef = database.ref(namedesevents_short+'/aux/day' + heutag + '/locations');
              // Listen for changes in the database
              databaseRef.on('value', (snapshot) => {
              if (snapshot.exists()) {
              eigensymbole_arr= snapshot.val();

              if(eigensymbole_arr.marker == undefined){eigensymbole_arr.marker = []}
              if(eigensymbole_arr.spotter == undefined){eigensymbole_arr.spotter = []}

              draw_marker()
              } else {
              console.log("No data available");eigensymbole_arr= {marker:[],spotter:[]}
              }
              }); 


ref = database.ref(namedesevents_short+'/aktuell');
/*
ref.on('value', (snapshot) => {//infotag.text("connected to database!"); 
{setTimeout(function (){d3.select('#lock').style('background-color',"green")},500)}
(errorObject) => 
// This callback will be called if there's an error connecting to the database
{d3.select('#lock').style('background-color',"yellow")}
})
*/
ref.on('value', (snapshot) => {
  console.log("änderung in current")
current = snapshot.val()
if(current==undefined){console.log('no current data');current = {};
  for(i=0;i<stages_list.length;i++)

      { k = stages_list[i].name
        current[k]={density:0,usage:0,tension:0}
}
console.log(current)
}

update_map()

});




}

function initialise_mapboxmap(){
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2FuZHJvc2NobWlkdCIsImEiOiJjbHg3bTMxYmwxMXZiMmtzY2tlN3RjNGY5In0.2whcv8hzfzdyukPAXWwSPw';

  map = new mapboxgl.Map({
    container: "map_div",
   // style: 'mapbox://styles/mapbox/satellite-streets-v12', 
    style: 'mapbox://styles/mapbox/streets-v12',
  // style: 'mapbox://styles/mapbox/satellite-v9',

    pitch: 0, // tilt for 3D
    bearing: -57, // angle to rotate map for better 3D view
    antialias: true // better 3D rendering
  });
  map.on('load', () => {
    drawPolygons();

    const geojson = {
      type: 'FeatureCollection',
      features: blocking_arr.map(block => ({
          type: 'Feature',
          geometry: {
              type: 'Polygon',
              coordinates: [
                block.coords.map(coord => [coord[1], coord[0]]) // flip lat/lng to lng/lat
            ]
          },
          properties: {
              name: block.name
          }
      }))
  };

  // Add GeoJSON source
  map.addSource('block-polygons', {
      type: 'geojson',
      data: geojson
  });

  // Add polygon fill layer (grey, 90% opacity, no outline)
  map.addLayer({
      id: 'block-fill',
      type: 'fill',
      source: 'block-polygons',
      paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.9
      }
  });

  medstations.forEach(marker => {
    const flippedCoords = [marker.coords[1], marker.coords[0]]; 
    // Create a custom element for the marker
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';

    // Set the icon (use a real image path or switch-case if using different styles)
    // Example: `icon: 'hospital'` resolves to `icons/hospital.png`
    el.style.backgroundImage = `url('icons/medicon.png')`;

    // Create and add the marker to the map
    new mapboxgl.Marker(el)
        .setLngLat(flippedCoords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(marker.name))
        .addTo(map);
});

setTimeout(() => {
  map.addSource('construction-plan', {
    type: 'image',
    url: './cad/arc25r.svg',
    coordinates: [
      [21.6515, 39.1027],  // top left (lng, lat)
      [21.6550, 39.1027],  // top right
      [21.6550, 39.1059],  // bottom right
      [21.6515, 39.1059]   // bottom left
    ]
  });
  
  map.addLayer({
    id: 'construction-plan-layer',
    type: 'raster',
    source: 'construction-plan',
    paint: {
      'raster-opacity': 1
    }
  });
}, 10000);
  
  });
  ;  

}
function initialise_map(){

  
  medicon = L.icon({  iconUrl: './icons/medicon.png', iconSize:     [20, 20], });
  mediconring = L.icon({  iconUrl: './icons/mediconring.png', iconSize:     [20, 20], });
  greenicon = L.icon({  iconUrl: './icons/green.png',  iconSize:     [40, 40],  iconAnchor:   [20, 40]})
  redicon = L.icon({  iconUrl: './icons/red.png',  iconSize:     [40, 40],  iconAnchor:   [20, 40]})
  resticon = L.icon({  iconUrl: './icons/restroom.png',  iconSize:     [20, 20],  iconAnchor:   [10, 10]})
// Karte und Hintergründe


 mymap.on('zoomend', function() {eventsettings.setview.zoom = mymap.getZoom()});
 mymap.on('moveend', function() {eventsettings.setview.center =mymap.getCenter()});



tl1= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{      
opacity: 0.8,      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
maxZoom: 25,
});

 Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
maxZoom: 25,

}).addTo(mymap)

 sat45 = L.tileLayer(
  'https://tiles.nextgis.com/region/SA/sat/{z}/{x}/{y}.png',
  {
    attribution: '© NextGIS / Sentinel-2',
    maxZoom: 18,
    minZoom: 5
  })
 mapboxToken = 'pk.eyJ1Ijoic2FuZHJvc2NobWlkdCIsImEiOiJjbHg3bTMxYmwxMXZiMmtzY2tlN3RjNGY5In0.2whcv8hzfzdyukPAXWwSPw'; // Ersetze durch deinen eigenen API-Token
 mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, {
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
   maxZoom: 25, // Unterstützt sehr hohe Zoomstufen
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxToken
});


 Jawg_Matrix =  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 25
})





stages_layer = L.layerGroup().addTo(mymap)
green_layer = L.layerGroup().addTo(mymap)
eigensymbole_layer = L.layerGroup().addTo(mymap)
movement_layer = L.layerGroup().addTo(mymap)
parkinglot_layer = L.layerGroup().addTo(mymap)
zones_layer = L.layerGroup()
back_layer = L.layerGroup().addTo(mymap)
aidstations_layer = L.layerGroup().addTo(mymap)
flucht_layer = L.layerGroup()

set_swipemode()




// alles einmalen das keine Bühnen sind
for (f=0;f<parking_arr.length;f++)  {

let l = eval(parking_arr[f].layer)
let fx = f
let polygon = L.polygon(parking_arr[f].coords, {color: parking_arr[f].color})

parking_list.geo.push(polygon)
/*
polygon.on('click',function(){
current[parking_arr[fx].name].usage += 10
if (current[parking_arr[fx].name].usage > 100){current[parking_arr[fx].name].usage =0}
//  current[parking_arr[fx].name].usage = Math.min(current[parking_arr[fx].name].usage,100)
a = new Date()
databaseRef = database.ref('soundstorm').child('aktuell').child(parking_arr[fx].name);
  databaseRef.set({usage: current[parking_arr[fx].name].usage,zeit:a.getTime()})
    })

    */


polygon.addTo(l)

var tooltip = L.tooltip({permanent: true, direction: 'center'})
.setContent(parking_arr[f].name)
.setLatLng(polygon.getBounds().getCenter())
.addTo(l);
parking_list.tooltip.push(tooltip)

}


/*
var fullscreenButton = L.easyButton('fa-arrows-alt', function(btn, mymap){
mymap.toggleFullscreen();
}, 'Toggle Fullscreen');
fullscreenButton.addTo(mymap);
*/


//for (f=0;f<inert_arr.length;f++)  {
//let l = eval(inert_arr[f].layer)
//let polygon = L.polygon(inert_arr[f].coords, {color: inert_arr[f].color}).bindTooltip(inert_arr[f].name).addTo(l)}


if(medstations){
for (f=0;f<medstations.length;f++) {medstations[f].geo = L.marker(medstations[f].coords,{icon:medicon}).bindTooltip(medstations[f].name)
  medstations[f].geo.addTo(aidstations_layer)}
}//medstations[f].geo .on("mouserover",function(e){this.openPopup()})

//for (f=0;f<greening_arr.length;f++) {let fu = f;L.polygon(greening_arr[f].coords, {color: 'green', "weight": 1,"opacity": 0.65, "fillOpacity":0.5 }).bindTooltip(greening_arr[f].name).addTo(green_layer)}
if(restrooms){
for (f=0;f<restrooms.length;f++) {L.marker(restrooms[f],{icon:resticon}).addTo(green_layer)}
//for (f=0;f<hinter.length;f++)       {let fu = f;L.polygon(hinter[f].coords, {color: 'none' ,"weight": 0,"fillOpacity": 0.7,"fillColor":"grey"}).addTo(green_layer)}
//for (f=0;f<vib_arr.length;f++)      {let fu = f;L.polygon(vib_arr[f].coords,{fillColor: '#6e737a',fillOpacity:1,color:"black",weight:1}).bindTooltip(vib_arr[f].name).addTo(green_layer)}
}
// Layercontroll
console.log(blocking_arr)
if(blocking_arr){
for (f=0;f<blocking_arr.length;f++) {let fu = f; L.polygon(blocking_arr[f].coords, {fillColor: "grey",color:"black", "weight": 1,"opacity": 1,fillOpacity:0.8}).bindTooltip(blocking_arr[f].name).addTo(green_layer)}
}
mymap.addControl(new L.Control.Fullscreen());
    
      
  
  //  "parking lots":parkinglot_layer,"op-zones":zones_layer
  

//ownmarker = L.marker(  [24.996,46.508]).addTo(mymap);

// Swipefunktion
let touchStartX, touchEndX;

mymap.on('click',function(e){

if(eventmarkertoggle == true){
  tcolor = "green"
  if(incident_toggle ==true){tcolor="red"; inciden_toggle = false}
jetzt = new Date()
  let eventloc = 
//   L.marker([e.latlng.lat,e.latlng.lng],{icon:eventicon}).addTo(mymap)
    userInput = prompt('describe marker:', '')
    if (userInput !== null) {
      randomNum = Math.floor(Math.random() * 9999) + 1;
    databaseRef = database.ref(namedesevents_short+'/aux/day' + heutag + '/locations/marker');
      eigensymbole_arr.marker.push({
      ort: [e.latlng.lat, e.latlng.lng],
      text: userInput,
      meldender: set_name,
      zeige: true,
      farbe:tcolor,
      zeit:jetzt.getTime(),
      endzeit:jetzt.getTime()+(1000*60*5)
  });

  // Save the updated data back to Firebase, using the array index as the key
  databaseRef.set(eigensymbole_arr.marker);
    

    

    eventmarkertoggle = false


    

  
    
}
}}
)


mymap.on('zoomlevelschange', function () {
// This event is triggered when the zoom level changes (e.g., button press)
// You can handle button press logic here
isZooming = true;
setTimeout(function () {
isZooming = false
}, 500);
});

mymap.on('zoomstart', function() {
isZooming = true;
});

mymap.on('zoomend', function() {
isZooming = false;
});


// hier werden die swipes aufgenommen und gespeichert in der firebase  


// Bühnen einmalen
stages_geo=[]

for(i=0;i<stages_list.length;i++)
{if(stages_list[i].coords != "donotdraw"){

let zi =i 
if(stages_list[i].coords == undefined){stages_list[i].coords =[]}
f = L.polygon(stages_list[i].coords, {color: '#99ff66'}).bindTooltip(stages_list[i].name)
//.on('mouseover',function(){this.setStyle({color:"red"})})
.on('click',function(){
// this.setStyle({color:"green"})
set_area=zi;d3.select('#dropdown').property('value',zi)
select_area(zi)

}).addTo(stages_layer,{ bubblingMouseEvents: false })
stages_list[i].geo = f
}}

if(fluchtrouten)
{for(i=0;i<fluchtrouten.length;i++)
 { 
var polyline = L.polyline(fluchtrouten[i], {
  color: 'red',
  weight: 1,
  opacity: 0.7,
  dash: [0,5]
}).addTo(flucht_layer);
}
// Add arrows to the polyline using PolylineDecorator
var decorator = L.polylineDecorator(polyline, {
  patterns: [
      {
          offset: '0', // Start offset
          repeat: '15', // Space between arrows
          symbol: L.Symbol.arrowHead({
              pixelSize: 5,
              polygon: true,
              pathOptions: {
                  stroke: true,
                  color: 'red',
                  weight: 1,
               //   opacity: 1
              }
          })
      }
  ]
}).addTo(flucht_layer);
}

}
function interpolateUndefined(arr) {
const nonEmptyIndices = arr.reduce((indices, value, index) => {
if (value !== null && value !== undefined) {
  indices.push(index);
}
return indices;
}, []);

// If there are less than 2 non-empty entries, return the original array
if (nonEmptyIndices.length < 2) {
return arr;
}

// Interpolate values between non-empty entries
for (let i = nonEmptyIndices[0] + 1; i < nonEmptyIndices[nonEmptyIndices.length - 1]; i++) {
const startIndex = Math.max(...nonEmptyIndices.filter((idx) => idx < i));
const endIndex = Math.min(...nonEmptyIndices.filter((idx) => idx > i));

// Linear interpolation formula
arr[i] = arr[startIndex] + (arr[endIndex] - arr[startIndex]) * (i - startIndex) / (endIndex - startIndex);

}


vorher = true
nachher= false
for (k=0;k<arr.length;k++){
if(vorher == true && arr[k] != undefined){vorher=false}
if(vorher == false && arr[k] == undefined){nachher = true


  if(nachher = true){
    arr[k] =arr[k-1]
    
    arr[k+1] =arr[k-1]
    arr[k+2] =arr[k-1]
    break
  }
}


}



return arr;
}
function make_graphdata_counts(indata){
//die indaten sind ein array mit jeweils den obj zeit und usage
//outdata = new Array(52).fill(undefined)
bucket = new Array(53).fill(undefined)

temp = new Date(indata.zeit[0])
//indata.zeit[0] = temp.getTime()
//indata.usage[0] = 0 
temp = temp.setHours(graphlinkegrenze,0,0,0)


for (i=0;i<indata.zeit.length;i++){

entfernungzu15uhr = parseInt(Math.round((indata.zeit[i]-temp)/(15*60*1000)))
    
if(entfernungzu15uhr > -1 && entfernungzu15uhr<65){
if (bucket[entfernungzu15uhr] == undefined){bucket[entfernungzu15uhr] = [indata.in[i]]}
  else{bucket[entfernungzu15uhr].push(indata.in[i])}
}
}

// Function to calculate the average of an array using a for loop
function calculateAverageWithForLoop(array) {
if (!array || array.length === 0) {
  return undefined; // Return undefined for empty or undefined arrays
}

let sum = 0;
let count = 0;

for (let i = 0; i < array.length; i++) {
  if (typeof array[i] === 'number') {
    sum += array[i];
    count++;  
  }
}

if (count === 0) {
  return 0//undefined; // Return undefined if all elements were undefined
}

return Math.round(sum / count);
}

// Calculate averages for each sub-array using for loops
outdata = [];
for (let i = 0; i < bucket.length; i++) {
const subArray = bucket[i];
const average = calculateAverageWithForLoop(subArray);
outdata.push(average)[0];
}
outdata = interpolateUndefined(outdata)

return {in:outdata,zeit:generateTimeArray(temp)}

}
function make_graphdata(indata){
//die indaten sind ein array mit jeweils den obj zeit und usage
//outdata = new Array(52).fill(undefined)
bucket = new Array(53).fill(undefined)

temp = new Date(indata.zeit[0])
//indata.zeit[0] = temp.getTime()
//indata.usage[0] = 0 
temp = temp.setHours(graphlinkegrenze,0,0,0)

for (i=0;i<indata.zeit.length;i++){

entfernungzu15uhr = parseInt(Math.round((indata.zeit[i]-temp)/(15*60*1000)))


if(entfernungzu15uhr > -1 && entfernungzu15uhr<(graphbreiteinviertelstunden+1)){
if (bucket[entfernungzu15uhr] == undefined){bucket[entfernungzu15uhr] = [indata.usage[i]]}
else{bucket[entfernungzu15uhr].push(indata.usage[i])}
}
}

// Function to calculate the average of an array using a for loop
function calculateAverageWithForLoop(array) {
if (!array || array.length === 0) {
return undefined; // Return undefined for empty or undefined arrays
}

let sum = 0;
let count = 0;

for (let i = 0; i < array.length; i++) {
if (typeof array[i] === 'number') {
sum += array[i];
count++;  
}
}

if (count === 0) {
return 0//undefined; // Return undefined if all elements were undefined
}

return Math.round(sum / count);
}

// Calculate averages for each sub-array using for loops
outdata = [];
for (let i = 0; i < bucket.length; i++) {
const subArray = bucket[i];
const average = calculateAverageWithForLoop(subArray);
outdata.push(average)[0];
}
outdata = interpolateUndefined(outdata)

return {usage:outdata,zeit:generateTimeArray(temp)}

}
function generateTimeArray(startTime) {
alert("?23 ")
const timeArray = [new Date(startTime)]; // Start with the provided time

for (let i = 1; i < 53; i++) {
const nextTime = new Date(timeArray[i - 1]);
nextTime.setMinutes(nextTime.getMinutes() + 15);
timeArray.push(nextTime);
}

return timeArray;
}
function addArrays(array1, array2) {
// Check if the arrays are of the same length
if (array1.length !== array2.length) {
throw new Error('Arrays must be of the same length');
}

// Create a new array to store the result
const resultArray = [];

// Loop through the arrays and add the values at each index
for (let i = 0; i < array1.length; i++) {
const sum = array1[i] - array2[i];
resultArray.push(sum);
}

return resultArray;
}
function make_graphdata_stages(indata,capacity,tager){
alert("?34")
//die indaten sind ein array mit jeweils den obj zeit und usage
//outdata = new Array(52).fill(undefined)
bucket_tension = new Array(52).fill(undefined)
bucket_density = new Array(52).fill(undefined)
bucket_usage = new Array(52).fill(undefined)

temp = new Date(indata.zeit[0])
//indata.zeit[0] = temp.getTime()
//indata.usage[0] = 0 

temp = temp.setHours(graphlinkegrenze,0,0,0)

// der fixe wert capacity der in der stages_list manuelll vegeben wurde * die auslastung ergibt die anzahlen
// capacity =

for (i=0;i<indata.zeit.length;i++){

entfernungzu15uhr = parseInt(Math.round((indata.zeit[i]-temp)/(15*60*1000)))

if(entfernungzu15uhr > -1 && entfernungzu15uhr<(graphbreiteinviertelstunden+1)){

if (bucket_density[entfernungzu15uhr] == undefined){
bucket_density[entfernungzu15uhr] = [indata.density[i]]}
else{bucket_density[entfernungzu15uhr].push(indata.density[i])}

if (bucket_tension[entfernungzu15uhr] == undefined){
bucket_tension[entfernungzu15uhr] = [indata.tension[i]]}
  else{bucket_tension[entfernungzu15uhr].push(indata.tension[i])}

  if (bucket_usage[entfernungzu15uhr] == undefined){
  bucket_usage[entfernungzu15uhr] = [indata.usage[i]]}
    else{bucket_usage[entfernungzu15uhr].push(indata.usage[i])}


}
}

// Function to calculate the average of an array using a for loop
function calculateAverageWithForLoop(array) {
if (!array || array.length === 0) {
return undefined; // Return undefined for empty or undefined arrays
}

let sum = 0;
let count = 0;

for (let i = 0; i < array.length; i++) {
if (typeof array[i] === 'number') {
  sum += array[i];
  count++;  
}
}

if (count === 0) {
return 0//undefined; // Return undefined if all elements were undefined
}

return sum / count;
}

// Calculate averages for each sub-array using for loops
function bucky(bucket){  outdata = [];
for (let i = 0; i < bucket.length; i++) {
const subArray = bucket[i];
const average = calculateAverageWithForLoop(subArray);
outdata.push(average)[0];
}
return interpolateUndefined(outdata)
}

b
outdata = {density:bucky(bucket_density),usage:bucky(bucket_usage),tension:bucky(bucket_tension),zeit:generateTimeArray(temp)}

return outdata

}
function estimateProgression(originalObject,ruck) {

xzeit=originalObject.zeit[originalObject.zeit.length-1]
xusage =originalObject.usage[originalObject.usage.length-1]

progressions_arr = {zeit:[],usage:[]}

steigung = (xusage - originalObject.usage[originalObject.usage.length-(ruck+1)])
zeitdelta = (xzeit - originalObject.zeit[originalObject.zeit.length-(ruck+1)])

// Estimate values for the next 3 hours (12 steps)
for(i=0;i<2;i++)
{  progressions_arr.zeit.push(xzeit + zeitdelta*i*ruck)
progressions_arr.usage.push(xusage + steigung*i*ruck)
}
return progressions_arr;
}
function removeEmptyEntries(object) {
const { zeit, usage } = object;

// Start iterating from the end of the arrays
for (let i = zeit.length - 1; i >= 0; i--) {
// Check if the corresponding value is not empty (customize this condition)
if (usage[i] !== undefined && usage[i] !== null && usage[i] !== '') {
  // Remove empty entries from the right side
  object.zeit = zeit.slice(0, i + 1);
  object.usage = usage.slice(0, i + 1);
  return object;
}
}

return { zeit: [], usage: [] };
}
function writeReportToFirebase() {
  jetzt = new Date()
  d3.select('#lock').style('background-color',"yellow")
 
  if (locked || set_name == "demo") {
    infotag.text('can not send reports or swipes when -LOCKED-')
    return;
  }else{

const database = firebase.database();


  databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("zeit");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
              currentArray.push(jetzt.getTime()); 
              
        return currentArray;
             });
      
  databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("usage");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
             currentArray.push(parseInt(set_usage));
             setTimeout(function (){d3.select('#lock').style('background-color',"green")},500)
              return currentArray;
             });

             databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("tension");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
             currentArray.push(parseInt(set_tens));
              return currentArray;
             });
             databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("density");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
             currentArray.push(parseInt(set_dens));
              return currentArray;
             });
             databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("meldender");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
             currentArray.push(set_name);
              return currentArray;
             });
             databaseRef = database.ref(namedesevents_short+'/day'+heutag).child(stages_list[set_area].name).child("position");
              databaseRef.transaction(function(currentArray) {
              currentArray = currentArray || [];
             currentArray.push(set_pos);
              return currentArray;
             });




  
       databaseRef = database.ref(namedesevents_short).child('aktuell').child(stages_list[set_area].name);
        databaseRef.set({zeit:jetzt.getTime(), density: set_dens, tension: set_tens,  usage: set_usage})

      }
}
function draw_marker(){
if(!mapbox){  eigensymbole_layer.clearLayers()
  if(realtime == true){drawjetzt = new Date().getTime();puffer =0}else{drawjetzt=settim;puffer = (1000*60*7)}
  
                        

for(let ip=0;ip<eigensymbole_arr.marker.length;ip++)
 {   
          if(eigensymbole_arr.marker[ip].endzeit+puffer > drawjetzt && eigensymbole_arr.marker[ip].zeit-puffer < drawjetzt ){
           


                    if(eigensymbole_arr.marker[ip].farbe =="red"){tempico=redicon}else{tempico = greenicon}

                    let tempmarker = L.marker(eigensymbole_arr.marker[ip].ort,{icon:tempico}).bindTooltip(eigensymbole_arr.marker[ip].text+ " - " +  getTimeOfDay (eigensymbole_arr.marker[ip].zeit)).addTo(eigensymbole_layer)//,
                    tempmarker.openTooltip()
                    tempmarker.on('click', function() {
              
                   
                      tempmarker.remove()
             
                     eigensymbole_arr.marker[ip].endzeit = drawjetzt
                    databaseRef = database.ref(namedesevents_short+'/aux/day' + heutag + '/locations/marker');
                    databaseRef.set(eigensymbole_arr.marker)
                  })
                
                  
        }
}


 Object.keys(eigensymbole_arr.spotter).forEach(key => {

  let tempmarker = L.marker(eigensymbole_arr.spotter[key].ort).bindTooltip(eigensymbole_arr.spotter[key].name).addTo(eigensymbole_layer)//,
  tempmarker.on('click', function() {
   tempmarker.remove()
 
 // }}
 })
});

}

}
function getTimeOfDay(milliseconds) {
  const date = new Date(milliseconds);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function set_swipemode(){
if(!mapbox){  if(swipemode){
 
    mymap.dragging.disable();
    mymap.touchZoom.disable();
    d3.select(mymap.getContainer())
          .on("touchstart", function(e){
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      start_time = new Date()})
          .on("touchend", function(e){
             if(!isZooming ){
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          ort1 = mymap.containerPointToLatLng([touchStartX,touchStartY]);
          ort2 = mymap.containerPointToLatLng([touchEndX,touchEndY]);
      
          minmove = 0.0002
          maxmove = 0.002
          move = Math.abs(ort1.lat - ort2.lat) + Math.abs(ort1.lng - ort2.lng)
          end_date = new Date()   
          diff = Math.ceil((end_date.getTime()-start_time.getTime())/500)
          www = 5*diff
       
          if(move> minmove && move <maxmove && diff < 4){ 
      
            if (locked || deviceversion != eventsettings.version) {
              infotag.text('can not send swipes when -LOCKED-')
        
              return;
              }
              else{
             
                ntemp = new Date()
                ntemp = ntemp.getTime()
                newEntry ={meldender:set_name,von:ort1, nach:ort2,zeit:parseInt(ntemp),endzeit:ntemp + (1000*60*5),dicke:www}
                swipes_arr.push(newEntry); // Add new entry to the array
            
                databaseRef =database.ref(namedesevents_short+'/aux/day' + heutag + '/swipes')
                databaseRef.set(swipes_arr)
      
                infotag.text("swipe reported. category:   "+ www/5)
              }}
  }});

  }else{

      
        mymap.dragging.enable();
        mymap.touchZoom.enable();
        mymap.doubleClickZoom.enable();
        mymap.scrollWheelZoom.enable();
        
        // Remove the touch event listeners using D3
        d3.select(mymap.getContainer())
          .on("touchstart", null)
          .on("touchend", null);
        

  
}}}


function update_map(){
  total_people_cur =0
for(i=0;i<stages_list.length;i++){
    if(current[stages_list[i].name] != undefined ){
      if(stages_list[i].hide != true){
        total_people_cur += ((current[stages_list[i].name].usage/100) *stages_list[i].capacity)}
        let temp = current[stages_list[i].name]
        let  fcol = farbskala[Math.round(temp.usage/10)]
        let col = farbskala[Math.min(10,Math.round(temp.density)*2)]
        if(!mapbox){stages_list[i].geo.setStyle({
            fillOpacity:0.6,
            fillColor: fcol,
            color: col,
            "weight": 3})}
    }
}

total_p.text(' Total on Site: ' + Math.round(total_people_cur).toLocaleString('en-US') + " / " + totalCapacity.toLocaleString('en-US'))
}
// TODO: das hier ist irgendwie wichtig wegen der veränderung der map-fanster. wenn man das raus nimmt wird die map nicht richtig gerendert:
/*setTimeout(function() {
  mymap.invalidateSize();
}, 2000);
*/