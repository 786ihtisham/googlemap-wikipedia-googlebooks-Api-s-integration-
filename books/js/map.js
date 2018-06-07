	 /*----- Starting the actaul Script for Google Map , Geocoding (process to converts actual -----
	------------------------------ adress to langitude and latitude) and Nearest places -----------*/
		var initMapDetailsList = false;    												//We are using this flag to show the map and nearest places list  after getting user input
																						//beasause google map automtically load during window loading therefore
																						//We have hide the map and nearest places list whenever flag becomes true map and list will show
	    var iconn,closestMarker;														// variables for icon and for marker
		//-------------------------- geocode  ---------------------------------------
		var longg = 73.0717; var latt = 33.6051;										//We have declared the lang and long variables and inialized with default values
		function showResult(result) {													//this function will show the lang and long values in the feilds (readonly feilds) after geocoding 
			document.getElementById('latitude').value = result.geometry.location.lat();	// setting values to the feilds ,getting from result (json) 
			document.getElementById('longitude').value = result.geometry.location.lng();
			 latt = document.getElementById('latitude').value;					//Now we are assigning the lat and long values to the actual lat,long variables which will 
		     longg = document.getElementById('longitude').value;				//show the location of user on the map
		}

		function getLatitudeLongitude(callback, address) {
																				// If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
			address = address || 'Ferrol, Galicia, Spain';
																				// Initialize the Geocoder
			geocoder = new google.maps.Geocoder();
			if (geocoder) {
				geocoder.geocode({
					'address': address     										//giving adress to the adress parameter and fuction to the second parameter
				}, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						callback(results[0]);
					}
				});
			}
		}
		
		var button = document.getElementById('btnn');                          // getting button element
		/* ------ It will call when user press the getLatLong btn , for geocoding ---------------*/
		function hello(){
			var address = document.getElementById('address').value;
			getLatitudeLongitude(showResult, address)							//By calling this function adress will be convert 
																				//to the geocode plus It will call one more function for displaying lat,long on the feilds
		}
		/*--------------- Function for showing nearest book store ,below to the form -------------*/
		function showBookStoree(){
			document.getElementById('closestPlace').style = "display:block !important";
		}
	  //-----------------------------------------------------------------
     
	  var map;																// map vaiable
      var infowindow;														//It will use as a tooltip whenever user click on any marker
	  /*-------------- map function itialization ------------------------*/
      function initMap() {
	  
	  if (initMapDetailsList == true){									// We have inialized this vaiable during declaration with false 
		document.getElementById('map').style = 'display:block';			//value, because map will automtically inialized during window load
		document.getElementById('placesList').style = 'display:block';  // So , We will show the map after getting info from user .
		
	  }
	  
	  initMapDetailsList = true;										//Now ,next time above condition will execute due to this 'true' value and map will show
	  var placesList = document.getElementById('placesList');			//getting placeList Div
																		// firstly remove all childs if exist 
	  while (placesList.hasChildNodes()) {
			placesList.removeChild(placesList.firstChild);
	  }
	  
      var pyrmont = {lat: parseFloat(latt) , lng: parseFloat(longg)};	//We will use this pyrmont variable
																		//as a location paremeter in map which contains the lat long points
        map = new google.maps.Map(document.getElementById('map'), {		//creating map object
          center: pyrmont,												//assigning location (pyrmont) to the center parameter which will show the user location 
          zoom: 15														//setting the default zoom level of map
        });
		
		
																		// creating  marker object
		var marker = new google.maps.Marker({
		  map: map,														// assigning map object
		  icon: 'marker.png',											// We have used our icon (blue) from local storage
		  title : 'My Location',										// Title when user click the mouse on marker
		  position: pyrmont												//giving position to draw the marker on exact user location
		});
		// -------------------------------------------------------------------------------------------------
		
		// ---------------------------------- For finding nearby places ----------------------------------
        infowindow = new google.maps.InfoWindow();						//creating infowindow object					
        var service = new google.maps.places.PlacesService(map);		//creating service object for nearby places
        service.nearbySearch({											//It will search places near to the user location 'pyrmont'
          location: pyrmont,
          radius: 5000,  												// It will search places to the distance  of 5000 meter ,Maximum distance is 50K meter we can change the distance
          type: ['book_store']											//We have restrict the type ,Our Web app only search  book stores nearest to user location( you can find a list of types e.g hospital,schools,restaurants etc from this url : https://developers.google.com/places/supported_types)
																		//Note : It is not user defined , only supported_types are allowed
        }, callback);
		 iconn = {														//definig icons for nearest book stores
			url: "bookmark.png", // url
			scaledSize: new google.maps.Size(50, 50), // scaled size
			origin: new google.maps.Point(0,0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
		};
      }
	  //--------------------------------------------------------------------------------------------------
	  

      function callback(results, status) {								//callback function
	   var str = JSON.stringify(results);								//for showing proper indent json on console
	    str = JSON.stringify(results,null,4);							// so we can read every property of near place and will show on  console
		console.log(str);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
																		//will return the closest nearest place
		  closestMarker = find_closest_marker(parseFloat(latt),parseFloat(longg),results);
		  // ------- showing the detail of nearest book store at the bottom of form -------------
		  document.getElementById('closestMarker').style = 'border : 3px solid grey;padding : 20px ;box-shadow : 0 0 10px 0px grey ; border-radius:20px';
		  document.getElementById('closestMarker').innerHTML = closestMarker.name+' <span style="font-size : 15px;letter-spacing:1px"> :  is nearest book store to you and you can visit through the  map. <hr class="dividerrr"> Address : '
				+ closestMarker.vicinity;
		  var btnnn = document.getElementById('btnn')
          
		  for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);                               //creating markers 
			displayResult(results[i]);								//passing an json and displaying every
																	//book store info as a div in a list form
          }
        }
      }
	  
	/*---------------- A function for making markers for nearest book stores ------------------*/
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
		  icon : iconn,
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
	  
	 // --------------- Function for displaying json for nearest book stores  ------------------
	 function displayResult(jsonn){
		// decalaring  variables for a every nearest book store which will store the info
		//of every store by creating(appending) childs nodes 
		var icon,json,jsonName,rating,vicinity;
		var iconImg,jsonH3,jsonNameH3,ratingH3,vicinityH3;
		var jsonSpan,jsonNameSpan,ratingSpan,vicinitySpan,br,hr;
		
		icon  = document.createElement('div');		//creating icon div for book stores
		json  = document.createElement('div');		//creating json (for book store title) div for book stores
		jsonName  = document.createElement('div');  // title div for book store
		rating = document.createElement('div');		//creaing div for rating of book store
		vicinity = document.createElement('div');   // vicinity (actual adress of book stores)
	    br = document.createElement('br');			// creating br element
	    hr = document.createElement('hr');			// creating  hr element for horizontal line
		iconImg = document.createElement('img');	//creaing img element
		jsonH3 = document.createElement('h3');		//creaing title heading
		jsonNameH3 =  document.createElement('h3');	//creaing actual title heading
		ratingH3 = document.createElement('h3');	//creaing rating heading
		vicinityH3 = document.createElement('h3');  //creaing adress heading
		
	    jsonSpan  = document.createElement('span');	
	    jsonNameSpan = document.createElement('span');
	    ratingSpan = document.createElement('span');
	    vicinitySpan = document.createElement('span');
		                                               // setting attribtes with values to all elements
		icon.setAttribute("style","width:85%;margin:auto;padding:10px;box-shadow: 0 0 12px 0px  grey;background-color:  #e6eeff");
		json.setAttribute("style","width:85%;margin:auto;padding:10px;box-shadow: 0 0 12px 0px grey;background-color:#c1bfbf;color:black");
		jsonH3.setAttribute("style","display:inline");
		jsonSpan.setAttribute("style","display:inline");
		jsonName.setAttribute("style","width:85%;margin:auto;padding:10px;box-shadow: 0 0 12px 0px grey;background-color: #e0dfdf;color:black");
		jsonNameH3.setAttribute("style","display:inline");
		jsonNameSpan.setAttribute("style","display:inline");
		rating.setAttribute("style","width:85%;margin:auto;padding:10px;box-shadow:0 0 12px 0px grey;background-color:#c1bfbf;color:black");
		ratingH3.setAttribute("style","display:inline");
		ratingSpan.setAttribute("style","display:inline");
		vicinityH3.setAttribute("style","display:inline");
		vicinitySpan.setAttribute("style","display:inline");
		
		
		
		
		iconImg.setAttribute("src",jsonn.icon); //setting icon from json icon url
		
		jsonH3.innerHTML = 'Location : ';
		jsonSpan.innerHTML = jsonn.vicinity;	//setting location
		jsonNameH3.innerHTML = 'Name of book store: ';
		jsonNameSpan.innerHTML = jsonn.name;	//setting title of book store
		ratingH3.innerHTML = ' Rating : ';
		ratingSpan.innerHTML = jsonn.rating;	//setting rating 
		
		icon.appendChild(iconImg);			// Now its time to append the all childs
		json.appendChild(jsonH3);			//to the parent element
		json.appendChild(jsonSpan);			
		placesList.appendChild(br);
		placesList.appendChild(hr);
		jsonName.appendChild(jsonNameH3);
		jsonName.appendChild(jsonNameSpan);
		placesList.appendChild(br);
		placesList.appendChild(hr);
		rating.appendChild(ratingH3);
		rating.appendChild(ratingSpan);
		placesList.appendChild(br);
		placesList.appendChild(icon);
		placesList.appendChild(json);
		placesList.appendChild(jsonName);
		placesList.appendChild(rating);
		placesList.appendChild(hr);
		
	  }
	  // ---------------Function for  calculating the smallest distance  -----------------------
function find_closest_marker( lat1, lon1,markers ) {    
    var pi = Math.PI;
    var R = 6371; //equatorial radius
    var distances = [];
    var closest = -1;

    for( i=0;i<markers.length; i++ ) {  
        var lat2 = markers[i].geometry.location.lat();
        var lon2 = markers[i].geometry.location.lng();

        var chLat = lat2-lat1;
        var chLon = lon2-lon1;

        var dLat = chLat*(pi/180);
        var dLon = chLon*(pi/180);

        var rLat1 = lat1*(pi/180);
        var rLat2 = lat2*(pi/180);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;

        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }

    // (debug) The closest marker is:
      console.log(markers[closest]);
      return markers[closest];
}
// function for displaying map because we have already display:none 
function showMap(){
	document.getElementById('map').style = 'display : block';
}