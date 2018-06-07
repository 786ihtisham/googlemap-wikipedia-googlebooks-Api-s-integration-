var btn;
var btn = document.getElementById('myInputButton');
var flagg; // this flag is used to delete the all childs of Parent elements
btn.addEventListener("click", function(){
	  var search = document.forms["myform"]["books"].value; // getting book name/author name /title
	  var ourRequest = new XMLHttpRequest(); // http request
	  ourRequest.open('GET',"https://www.googleapis.com/books/v1/volumes?q=" + search); //open request
	  ourRequest.onload = function() {
		
		if (ourRequest.status >= 200 && ourRequest.status < 400) {
			  var response = JSON.parse(ourRequest.responseText);    // parsing the request
			  if(search == "") // checking if feild is empty 
			  {
				alert("Please enter something in the field");
			  }
			  else{	
				//firstly scroll down
				  var remove = document.getElementById('result');
				// firstly remove all childs if exist 
				  if(flagg == false){
					  while (remove.hasChildNodes()) {
						remove.removeChild(remove.firstChild);
					}
				  }
				  var url = ""; // for the url of that book
				  var img = "";	// for book image
				  var title = ""; // for book title
				  var author = ""; // for book,s author
				  
				// sending request to server, after request proccessing the server sends the result through 'response'
				// responce is the json string and 'q' for  inializing  with user input
				
				
			  //$.get("https://www.googleapis.com/books/v1/volumes?q=" + search,function(response){
				
				  for(i= 0; i < response.items.length; i++)
				  {	
					var  res = document.getElementById('result'); 			// getting parent elem because after creating all child we will append child to parent
					res.style = 'display:block';    						//firstly show the result div because we have already hide this div
					var hr = document.createElement('hr'); 					// make a  horizontal line
					var col = document.createElement('div'); 				// creating a col div because we have to append this col to row (result) div
					var buttonn = document.createElement('button'); 		// creating a detail button
					img = document.createElement('img'); 					// creating a img element
					var buttonnText = document.createTextNode('Details'); 	// creating a text node for detail button
					
					var attribute = document.createAttribute('class'); 		// creating a class attribute for col div
					var type = document.createAttribute('type');			// creating type attr for button
					var buttonClass = document.createAttribute('class');	//  creating attr  class for button  
					var buttonId = document.createAttribute('id');    		// creatind id attr for button
					var hrClass = document.createAttribute('class'); 		// creating attr class for hr 
					var imgSrc = document.createAttribute('src');   		// creating src attr for img  
					
					attribute.value = 'col-3' ;								//setting values to all attributes
					hrClass.value = 'divider1' ;
					type.value = 'button' ;
					buttonClass.value = 'bookButton' ;
					buttonId.value = 'id'+i ;
					
					col.setAttributeNode(attribute);						// Now setting attributes to elementss 
					buttonn.setAttributeNode(type);
					buttonn.setAttributeNode(buttonClass);
					buttonn.setAttributeNode(buttonId);
					hr.setAttributeNode(hrClass);
					img.setAttribute("class","responsive1");
					
						
				   url = response.items[i].volumeInfo.imageLinks.thumbnail; // getting url for image from json
				   var flag = checkButtonIsClicked(buttonn,i,response);		// it will call and check that the detail btn is clicked or not
																			// if clicked then remove the grid and show the particular book with all details by passing 'i' index
				   img.setAttribute("src",url);								//set src path for image
				   
				   col.appendChild(img);									//append image to col
				   col.appendChild(buttonn);								//then append the detail button
				   col.appendChild(hr);										//append hr line to col after the btn
				   buttonn.appendChild(buttonnText);						//append the text to the btn
				   res.appendChild(col);									//Now append the col to row
												
				   var str = JSON.stringify(response);						// for showing the whole json on browser console
				   str = JSON.stringify(response, null, 4); 				// (Optional) beautiful indented output.
				   console.log(str); 										// Logs output to dev tools console.
					
					if( i == 31){											// condition for 8x4 grid (we have restricted only for 8x4 grid)
						break;
					}
				  }
				  
				  window.scrollBy(0, 500); 									//after submission of form we have to scroll down
				  flagg = false;											//now false the flag because during next time this flag will help
																			// to remove old childs
			 
			  
			  }
		 
		 // return false;
						  
		} else {
		  console.log("We connected to the server, but it returned an error.");
		}
		
	  };

	  ourRequest.onerror = function() {
		console.log("Connection error");
	  };

	  ourRequest.send();
			  
});
	//---------------------------------------------------
   
// function for displaying a particular book using 'i' index , buttonn , jsObj
function checkButtonIsClicked(buttonn,i,jsObj){
	
	buttonn.addEventListener('click',function(){	 
		// after clicking detail btn this below script will show the details for a particular book
		//but before doing that we have to hide the grid 
		document.getElementById('result').style = 'display:none';
		document.getElementById('section1ForSearch').style = 'display:none';
		document.getElementById('goBack').style = 'display:block';
		document.getElementById('viewBook').style = 'display:block';
		//alert(jsObj.items[i].volumeInfo.previewLink);
		document.getElementById('viewBook').setAttribute("href",jsObj.items[i].volumeInfo.previewLink);
		document.getElementById('particularBookPage').style = 'display:block';
		document.getElementById('title').innerHTML = '<hr>'+jsObj.items[i].volumeInfo.title;
		document.getElementById('author').innerHTML = ' By : '+jsObj.items[i].volumeInfo.authors;
		document.getElementById('publisher').innerHTML = '<hr><br><h3 style="display:inline">Publisher  : </h3> <span style="display:inline">'+jsObj.items[i].volumeInfo.publisher+'</span>';
		document.getElementById('publishedDate').innerHTML = '<br><h3 style="display:inline">Published Date  : </h3> <span style="display:inline">'+jsObj.items[i].volumeInfo.publishedDate+'</span>';
		document.getElementById('description').innerHTML = '<h3> Description  : </h3> <p>' +jsObj.items[i].volumeInfo.description+'</p>';
		document.getElementById('categories').innerHTML = '<br><h3 style="display:inline" > Categories  : </h3> <span style="display:inline">' +jsObj.items[i].volumeInfo.categories+'</span>';
		document.getElementById('averageRating').innerHTML = '<br><h3 style="display:inline" > Average Rating  : </h3> <span style="display:inline">' +jsObj.items[i].volumeInfo.averageRating+'</span>';
		document.getElementById('ratingsCount').innerHTML = '<br><h3 style="display:inline" > Ratings Count  : </h3> <span style="display:inline">' +jsObj.items[i].volumeInfo.ratingsCount+'</span>';
		document.getElementById('maturityRating').innerHTML = '<br><h3 style="display:inline" > Maturity Rating  : </h3> <span style="display:inline">' +jsObj.items[i].volumeInfo.maturityRating+'</span>';
		document.getElementById('language').innerHTML = '<br><h3 style="display:inline" > Language  : </h3> <span style="display:inline">' +jsObj.items[i].volumeInfo.language+'</span>';
		document.getElementById('thumbnail').innerHTML = '<img width="100%" height="100%" style="box-shadow: 0 0 7px 0px black " src = '+jsObj.items[i].volumeInfo.imageLinks.thumbnail+'/>';
		
		return i;
	});
	
	
}

// function for scrolling
function scrollToBottom(){
   window.scrollBy(0, 500);
}
	
var goBackButton = document.getElementById('goBack');
goBackButton.addEventListener('click',function(){
	document.getElementById('result').style = 'display:block';
	document.getElementById('section1ForSearch').style = 'display:block';
	document.getElementById('particularBookPage').style = 'display:none';
});
//------------------ function for showing navigaton for a mobile view 


function showNavigation(){
	var nav = document.getElementById("navBar");
	nav.style = "display:block !important";
	
}


function hideNavigation(){
	
		var nav = document.getElementById("navBar");
		nav.style = "display:none ";
	
	
}