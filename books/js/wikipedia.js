// declaring variales and accessing the all usefull divs
var inputString,article,btnnn,errorr,innerDiv,article;
btnnn = document.getElementById('btnnn');
article = document.getElementById('article');
errorr = document.getElementById('error');
innerDiv = document.getElementById('innerDiv');
article = document.getElementById('article');

/* ------------------------ Function for getting value from user input (query) ----------------*/
function getValue(){
	var inputValue = document.getElementById('wikiId').value;
	return inputValue;
}
/* ----------------------- We will show the content  on clicking btn from the form ------------- */
btnnn.addEventListener('click',function(){
		 var remove = document.getElementById('article'); //firstly create remove variable and access the article div
		 while (remove.hasChildNodes()) {				  //for removing previus content if exist from child nodes like p tag
			remove.removeChild(remove.firstChild);
		 }
		 inputString = 'mosque';						  // assigning hard code value (default)
		 inputString = getValue();						  //getting value from user by calling getValue()
		 showResult();									  //will show the content (summary) by calling showResult()
		 
});

/*-------------------------  Function to show the summary ----------------------------------------*/
function showResult(){

	$.ajax({	//ajax method for sending http request to the server that will send back respoce as a json
		url: "https://en.wikipedia.org/w/api.php",	//url of the wikipedia api
		data: {										//2nd parameter 'data' to ajax call 
			format: "json",							//telling the format must be json
			action: "parse",						// action is to parse the json
			page: inputString,						// setting inputted data (query) from the user
			prop:"text",							
			section:0,
		},
		dataType: 'jsonp',							//datatype must be jsonp
		headers: {									//defining headers
			'Api-User-Agent': 'MyCoolTool/1.1 (http://example.com/MyCoolTool/; MyCoolTool@example.com) BasedOnSuperLib/1.4'
		},
		success: function (data) {					//5th parameter after successing there  is a response parameter 
													//	after server replying
			console.log(data);						//displaying on console to check and read the properties names in json format
			if( data.error){
				errorr.innerHTML = data.error.info; //condition will execute if page is not present and show the error through errorrr div by setting error value
				document.getElementById('article').style = 'display:none'; //Hide the Actual result div because We have styled already   
				document.getElementById('error').style = 'display:block';	//show the error div
			}
			var markup = data.parse.text["*"];								//parse the data and save to markup vaiable
			var i = innerDiv.innerHTML = markup;							//setting markup to i and innerDiv
			
			$('#article').html($(i).find('p'));								//We have used a jquery function to get only the paragraph text from the content 
																			//which is the summary
			article.style = 'display:block';								//Now show the summary div

		}		
		
	});

}
