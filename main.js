var indexUser=0; 
var formIndex=0; // login form index
var fields=0;

var userNameSel="";
var passWordSel="";
var passWordSel2="";
var userManualFilled=0;
var passWordValue="";
var userNameValue="";
var passElementActive;
var getPassword=false;
var listOfForms=[];
var newListForms=[];
/////////////////////////////////////

browser.runtime.sendMessage(
	{'CMD':'INIT','username':null,'url':'','action':''},
	function (response) {
			
		//console.log(response);
	});
/////////////////////////////////////////
document.addEventListener('click',function(){

    browser.runtime.sendMessage(
        {'CMD':'UPDATETAB','username':null,'url':'','action':''},
        function (response) {

            //console.log(response);
        });

});


document.addEventListener('DOMContentLoaded',function(){

	///////////////////////
	$( window ).load(function(){





        newListForms=listOfForms=Object.values(document.forms);
        var tid = setInterval( function () {
            findFormLogin();
           
        }, 1000 );

		browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

			switch(request['CMD']){

				case 'MENU':
                    sendResponse({ success: true });
						browser.runtime.sendMessage(
							{'CMD':'MENU'},
							function (response) {
								;
							});	
				break;
				
			}
			
				
		});

		//putGeneratePass();

	});
});

///////////////////////find submit forms/////////

function findFormLogin(){
	try{
	
		existPass=false;

		var _listOfForms=Object.values(document.forms);
        _listOfForms.forEach(function(_f){
            if(listOfForms.length==0){
                listOfForms.push(_f);
                newListForms.push(_f);
            }
          else if(listOfForms.includes(_f)==false){

              listOfForms.push(_f);
              newListForms.push(_f);
          }

        });
		for (var formIndex = 0; formIndex < newListForms.length; formIndex++) {

			for (var countElementsForm = 0; countElementsForm < newListForms[formIndex].length; countElementsForm++) {
				if(newListForms[formIndex].elements[countElementsForm].type!="password" && existPass==false)
					continue;
				existPass=true;
				if(newListForms[formIndex].elements[countElementsForm].type!="submit" && newListForms[formIndex].elements[countElementsForm].type!="button" )
					continue;
				"click onsubmit"
                newListForms[formIndex].elements[countElementsForm].addEventListener("click", function(e){
					var countElementsForm=	this.form.elements.length-1;
					var usernameElement="";
					var userName="";
					var pass="";
					for(i=0;i<=countElementsForm;i++){
						
						if( this.form.elements[i].type=='password'){
							
								userName=getUserName(this.form);
								pass= this.form.elements[i].value;
								if( pass=="" ){
									
									return;
								}
								browser.runtime.sendMessage(
								{'CMD':'SUBMIT','username':userName,'url':document.location.origin,'action':this.form.action,'pass':pass},
								function (response) {
									;
								});	
								break;
						}
						
					}

				});		
				//return true;
			}
		}
		if(existPass==true){

			browser.runtime.sendMessage(
							{'CMD':'PASSEXIST'},
							function (response) {
								;
							});	
			
		}
	}catch(err){
		
		console.log(err);
		
	}finally {
        newListForms=[];
    }
}
/////////////////////////////////////////////////////////////////////////////////////	

function findLoginFormIframe(typeElement){
	try{
		var IframeformsIndex=document.getElementsByTagName('iframe');

		
		for (var IframeformIndex = 0; IframeformIndex < IframeformsIndex.length; IframeformIndex++) {
			if(IframeformsIndex[IframeformIndex].contentWindow.document.forms==null)
				continue;
			for (var formIndex = 0; formIndex < IframeformsIndex[IframeformIndex].contentWindow.document.forms.length; formIndex++) {

					for (var countElementsForm = 0; countElementsForm < IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex].length; countElementsForm++) {
								if( IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex].elements[countElementsForm].type=='password' && IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex].elements[countElementsForm-1].id!='titleEditForm_betterkey'){
									if(typeElement=='pass')
										return IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex].elements[countElementsForm];
									else{
										//formclear(IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex]);
										return IframeformsIndex[IframeformIndex].contentWindow.document.forms[formIndex].elements[countElementsForm-1];
									}
								}
						
					}

			}
		}
	}catch(err){
		console.log(err);

	}
}
/* search username & password element */
/*return form &  username & password element */
function findFormsWithPass(){
	
	var formElements=[];
	var count=0;
	usernameElement="";
	passwordElement="";
	for (var formIndex = 0; formIndex < document.forms.length; formIndex++) {

		for (var countElementsForm = 0; countElementsForm < document.forms[formIndex].length; countElementsForm++) {
			if(document.forms[formIndex].elements[countElementsForm].type!="password" )
				continue;
			passwordElement=document.forms[formIndex].elements[countElementsForm];
			for (var counterElementsForm = countElementsForm; counterElementsForm >= 0; counterElementsForm--) {
				if(document.forms[formIndex].elements[counterElementsForm].type=="text" || document.forms[formIndex].elements[counterElementsForm].type=="email" || document.forms[formIndex].elements[counterElementsForm].type=="number" ||  document.forms[formIndex].elements[counterElementsForm].type=="url" ){
					usernameElement=document.forms[formIndex].elements[counterElementsForm];
					break;
				}
				
			}

			formElements.push([document.forms[formIndex],passwordElement,usernameElement]); //add password element /add username element
			break;
		}
		
	}
	
	return formElements;
	
}
/*
function putGeneratePass(){

	var count=0;
	var forms=findFormsWithPass();
	var findRegisterFrom=false;
	var findForms=[];
		
		//first step for find password
		for (var formIndex = 0; formIndex < forms.length; formIndex++) {

			for (var countElementsForm = 0; countElementsForm < forms[formIndex][0].length; countElementsForm++) {
				
				if(forms[formIndex][0].elements[countElementsForm].type!="password"  || forms[formIndex][0].elements[countElementsForm-1].type=="password")
					continue;
				if(forms[formIndex][0].elements[countElementsForm+1].type=="password"  && forms[formIndex][0].elements[countElementsForm+2].type=="password"){
					findRegisterFrom=true;
					findForms.push(forms[formIndex][0]);
					console.log(findForms);
					
					forms[formIndex][0].elements[countElementsForm+1].addEventListener("focus", function(e){
						passWordSel=this;
						for (var countElementsForm = 0; countElementsForm < this.form.length; countElementsForm++) {
							if(this.form.elements[countElementsForm]==passWordSel && this.form.elements[countElementsForm+1].type=="password"){
								passWordSel2=this.form.elements[countElementsForm+1];
								break;
							}
						}
						//check forgot pass field
						browser.runtime.sendMessage(
								{'CMD':'GENERATEPASSWORD','username':"",'url':document.location.origin,'action':document.activeElement.form.action},
								function (response) {
									;
								});	
						
					});
					
				
				}else if(forms[formIndex][0].elements[countElementsForm+1].type=="password" ){
					findRegisterFrom=true;
					passWordSel2=forms[formIndex][0].elements[countElementsForm+1];
					findForms.push(forms[formIndex]);
					forms[formIndex][0].elements[countElementsForm].addEventListener("click", function(e){
					////////////////////////////////////////
					passWordSel=this;
					for (var countElementsForm = 0; countElementsForm < this.form.length; countElementsForm++) {
							if(this.form.elements[countElementsForm]==passWordSel && this.form.elements[countElementsForm+1].type=="password"){
								passWordSel2=this.form.elements[countElementsForm+1];
								break;
							}
						}
					//////////////////////////////////////////////

						browser.runtime.sendMessage(
								{'CMD':'GENERATEPASSWORD','username':"",'url':document.location.origin,'action':document.activeElement.form.action},
								function (response) {
									;
								});	
						
					});
				}
				
				
				
			}
		
		}
	
	//second step for find password
	if(forms.length>1 && findRegisterFrom==false){
		registerForm=FindMaxElementsForm(forms);
		if(findForms.length==0)
			registerForm[1].addEventListener("click", function(e){
				passWordSel=this;
			
				browser.runtime.sendMessage(
									{'CMD':'GENERATEPASSWORD','username':"",'url':document.location.origin,'action':""},
									function (response) {
										;
									});	
									
				window.addEventListener('message', getPassIframe);
			
		});
		
		for(i=0;i<findForms.length;i++){
			if(registerForm==findForms[i])
				continue;
			registerForm[1].addEventListener("click", function(e){
				passWordSel=this;

				browser.runtime.sendMessage(
									{'CMD':'GENERATEPASSWORD','username':"",'url':document.location.origin,'action':""},
									function (response) {
										;
									});	
		
			
			});
		}
		
		
	}
	
}
*/
function getPassIframe(event) { 
	if(JSON.parse(event.data).type=="pass" ){
		if( JSON.parse(event.data).autofill==true ){
			passWordSel.value="";
			passWordSel2.value="";
			//$(passWordSel).sendkeys(JSON.parse(event.data).data);
			//$(passWordSel2).sendkeys(JSON.parse(event.data).data);
		
		
		}
		var countElementsForm=	document.activeElement.form.elements.length;
		for(i=0;i<countElementsForm;i++){
			
			if( document.activeElement.form.elements[i].type=='password'){
				
				var userName=document.activeElement.form.elements[i-1].value;
				var pass= document.activeElement.form.elements[i].value;
				browser.runtime.sendMessage(
				{'CMD':'SUBMIT','username':userName,'url':document.location.origin,'action':document.activeElement.form.action,'pass':pass},
				function (response) {
					;
				});	
				break;
			}
			
		}

	}
	
}
function FindMaxElementsForm(findForms){	//find register form
	var largest = 0;
	var countElement=0;
	var formLogin;

	findForms.forEach(function(form){
		countElement=0;
		for(var i=0;i<form[0].length;i++){
			if(form[0][i].type=="hidden")
				continue;
			countElement++;
			
		}
		
		
	  if(largest < countElement){ 
		formLogin = form;
		largest=countElement;
		}
	});

	return formLogin;
		
}
function FindMinElementsForm(formElements){	//find login form
	var lowest = 100;
	var formLogin=[];
	countElement=0;
	formElements.forEach(function(elem){
	countElement=0;	
	for(var i=0;i<elem[0].length;i++){
		if(elem[0][i].type=="hidden" || elem[0][i].type=="fieldset" )
			continue;
		countElement++;
		
	}
	if(lowest  >= countElement){ 
		if(lowest==countElement){
		formLogin.push( elem);
		}else{
			formLogin=[];
			formLogin.push( elem);
		}
		lowest=countElement;
		userNameSel=elem[2];
		console.log(userNameSel);
		}
	});

	return formLogin;
		
}
function getLoginFormIframe(typeElement,autofill){
	try{


		var IframeformsIndex=document.getElementsByTagName('iframe');

		
		for (var IframeformIndex = 0; IframeformIndex < IframeformsIndex.length; IframeformIndex++) {
			if(IframeformsIndex[IframeformIndex]!=null && 	typeElement=='user'){
					IframeformsIndex[IframeformIndex].contentWindow.postMessage('{"data":"'+username_BK+'","type":"user"}' , '*'); 
			}
			else if(IframeformsIndex[IframeformIndex]!=null && 	typeElement=='pass'){
					IframeformsIndex[IframeformIndex].contentWindow.postMessage('{"data":"'+password_BK+'","type":"pass","autofill":'+autofill+'}', '*'); 
			}
			
		}
	}catch(err){
		console.log(err);

	}
}

function formclear(form){
	try{
	if(form==null){
		
		for (var formIndex = 0; formIndex < document.forms.length; formIndex++) {

			for (var countElementsForm = 0; countElementsForm < document.forms[formIndex].length; countElementsForm++) {
				var typeEl=document.forms[formIndex].elements[countElementsForm].type;
						if(typeEl=='password' || typeEl=='text' || typeEl=='email'|| typeEl=='number'|| typeEl=='url'){
							
								//document.forms[formIndex].elements[countElementsForm-1].value='';
								document.forms[formIndex].elements[countElementsForm].value='';
								
						}
				
					}

				}		
	}else{
		counterElementsForm=form.elements.length-1;
		while(form.elements[counterElementsForm]!=null){
			var typeEl=	form.elements[counterElementsForm].type;
			if( typeEl=='password' || typeEl=='text' || typeEl=='email'|| typeEl=='number'|| typeEl=='url'){
					form.elements[counterElementsForm].value='';
				//	form.elements[counterElementsForm-1].value='';
				//	break;
				
			}
			counterElementsForm--;
		}
	
		//return	form;
	}
	}catch(err){
		console.log(err);
		
	}
}

function fillPassWithGen(password,autofill){

	var userName="";
	var elActive=document.activeElement;
	
	if(elActive.form!=null)
	 userName=getUserName(elActive.form);

	browser.runtime.sendMessage(
	{'CMD':'SUBMIT','username':userName,'url':'','action':'','pass':password},
	function (response) {
		;
	});	

		
	
}
function showMenu(){
	browser.runtime.sendMessage(
			{'CMD':'JUSTMENU','username':"",'url':document.location.origin,'action':""},
			function (response) {
				;
			});	
	
	
}
function fillForm(userData,passData){
	
	if(userNameSel=="" || userNameSel==null){
	var IframeformsIndex=document.getElementsByTagName('iframe');
		//[0].contentWindow.document.forms
		
		for (var IframeformIndex = 0; IframeformIndex < IframeformsIndex.length; IframeformIndex++) {
			if(IframeformsIndex[IframeformIndex]!=null ){
					IframeformsIndex[IframeformIndex].contentWindow.postMessage('{"user":"'+userData+'","pass":"'+passData+'","type":"user"}' , '*'); 
			}
	
			
		}

	}else if(userNameSel.type=="text" || userNameSel.type=="email" || userNameSel.type=="number" ||  userNameSel.type=="url"){
		//formclear(userNameSel.form);

		for (var countElementsForm = 0; countElementsForm < userNameSel.form.length; countElementsForm++) {
				if(userNameSel.form.elements[countElementsForm+1].type=="password"){
					try{
					//$(userNameSel).sendkeys(userData);
					//$(userNameSel.form.elements[countElementsForm+1]).sendkeys(passData);
					}catch(err){
						//$(userNameSel).val(userData);
						//$(userNameSel.form.elements[countElementsForm+1]).val(passData);
						
					}
					break;
				}
			}
		}
	
}
function getUserName(form){
	countElementsForm=form.elements.length;
	var usernameElement="";
	for (var counterElementsForm = 0; counterElementsForm< countElementsForm; counterElementsForm++) {
				if(form.elements[counterElementsForm].value !="" && ( form.elements[counterElementsForm].type=="text" || form.elements[counterElementsForm].type=="email" || form.elements[counterElementsForm].type=="number" || form.elements[counterElementsForm].type=="url") ){
					return form.elements[counterElementsForm].value;
					break;
				}
				
			}
	return "";
}
function funcReadyGetData(fid){
	console.log("funcReadyGetData");
		if(userNameSel=="") whichFill2();
	else userNameSel.focus();
	browser.runtime.sendMessage({'CMD':'READYDATA'},
	function (response) {
		
		//console.log(response);
	});
	
}
function funcReadyGetDataPass(fid){
	console.log("funcReadyGetDataPass");
	browser.runtime.sendMessage({'CMD':'READYDATAPASS'},
	function (response) {
		
		//console.log(response);
	});
	
}
function whichFill2() {
    passWordSel = ""; //reset data
   
    var findElement = 0; //0 nothing //1 find //2 not found
    if (document.activeElement.type != "password") {
        var formElements = findFormsWithPass();
        if (formElements.length > 0) {
            var formEl = FindMinElementsForm(formElements);
            if (formEl.length > 1) {
                for(var i=0;i<formEl.length;i++){

                    if (formEl[i][2] == document.activeElement) {
                        formclear(frm[0]);
                        userNameSel = formEl[i][2];
                        userNameSel.focus();
                        //$(userNameSel).focus();
                        return;
                    }
                }

            } else {

                userNameSel = formEl[0][2];
                formclear(formEl[0][0]);
                userNameSel.value="";
                //$(userNameSel).val("");
                //$(userNameSel).focus();
				userNameSel.focus();

            }

        } else if (document.activeElement.type == "text" || document.activeElement.type == "email" || document.activeElement.type == "number" || document.activeElement.type == "url") {
            userNameSel = document.activeElement;
            userNameSel.value = "";
            formclear(userNameSel.form);
        }
    }


}


function whichFill() {
	
    passWordSel = ""; //reset data
    try {

        var findElement = 0; //0 nothing //1 find //2 not found
        if (document.activeElement.type != "password") {
            var formElements = findFormsWithPass(); //find login form with password element
         if (document.activeElement.type == "text" || document.activeElement.type == "email" || document.activeElement.type == "number" || document.activeElement.type == "url")
            {
                userNameSel = document.activeElement;
                userNameSel.value = "";
                formclear(userNameSel.form);
                browser.runtime.sendMessage(
                    {'CMD': 'GETUSER', 'username': null, 'action': ""},
                    function (response) {

                        //console.log(response);
                    });
            }
            else if (formElements.length > 0) {
                var formEl = FindMinElementsForm(formElements);
                if (formEl.length > 1) {
                    //find active element
                    for(var i=0;i<formEl.length;i++){
                        if (formEl[i][2] == document.activeElement) {
                            formclear(formEl[i][0]);
                            userNameSel = formEl[i][2];
                            userNameSel.focus();

                            browser.runtime.sendMessage(
                                {'CMD': 'GETUSER', 'username': "",  'action': ""},
                                function (response) {
                                    //console.log(response);

                                });

                            return;
                        }
                    }
                    //send message for request to click the form
                    browser.runtime.sendMessage({'CMD': 'CANNOTFIND'},
                        function (response) {

                            //console.log(response);
                        });
                    return;

                } else {
                    userNameSel = formEl[0][2];
                    userNameSel.value="";
                    //$(userNameSel).val("");
                    userNameSel.focus();
                   // $(userNameSel).focus();
                    formclear(formEl[0][0]);
                    browser.runtime.sendMessage(
                        {'CMD': 'GETUSER', 'username': "",  'action': ""},
                        function (response) {
                            //console.log(response);
                        });

                    return;
                }
                browser.runtime.sendMessage(
                    {'CMD': 'GETUSER', 'username': "",  'action': ""},
                    function (response) {

                        //console.log(response);
                    });

            }
            //manual find form by user if can not find form
             else if( document.querySelectorAll("input[type=text]")>0) {
            	//Maybe exist login form without tag form
                browser.runtime.sendMessage({'CMD': 'CANNOTFIND'},
                    function (response) {

                        //console.log(response);
                    });
			}else{
                //send message to background that this frame dont have any login form

                browser.runtime.sendMessage(
                    {'CMD': 'ANYFORM', 'username': null,  'action': ""},
                    function (response) {

                        //console.log(response);
                    });
            }
        }
        else {
            document.activeElement.value="";
            if (userNameSel == "" || userNameSel == null) {
                //check if username element fill or not

                countElementsForm = document.activeElement.form.elements.length;
                for (var counterElementsForm = 0; counterElementsForm < countElementsForm; counterElementsForm++) {
                    if (document.activeElement.form.elements[counterElementsForm].type == "text" || document.activeElement.form.elements[counterElementsForm].type == "email" || document.activeElement.form.elements[counterElementsForm].type == "number" || document.activeElement.form.elements[counterElementsForm].type == "url") {
                        userNameSel = document.activeElement.form.elements[counterElementsForm];
                        browser.runtime.sendMessage(
                            {'CMD': 'GETPASS', 'username': userNameSel.value,  'action': ""},
                            function (response) {

                                //console.log(response);
                            });
                        return;
                    }

                }

                browser.runtime.sendMessage(
                    {'CMD': 'GETPASS', 'username': "",  'action': ""},
                    function (response) {

                        //console.log(response);
                    });
            } else {

                browser.runtime.sendMessage(
                    {'CMD': 'GETPASS', 'username': userNameSel.value, 'action': ""},
                    function (response) {

                        //console.log(response);
                    });
            }
		}
 
    } catch(err) {

        console.log(err);
        //remove this frame
        browser.runtime.sendMessage(
            {'CMD': 'ANYFORM', 'username': null, 'action': ""},
            function (response) {
            	//console.log(response);
            });

    }
	 

}

