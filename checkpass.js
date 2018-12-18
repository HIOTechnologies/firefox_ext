if(document.activeElement.type=="password"){
	document.activeElement.value="";
	if(userNameSel.type=="text" || userNameSel.type=="email" || userNameSel.type=="number" ||  userNameSel.type=="url"){

		for (var countElementsForm = 0; countElementsForm < userNameSel.form.length; countElementsForm++) {
			if(userNameSel.form.elements[countElementsForm].type=="password"){


				browser.runtime.sendMessage(
					{'CMD':'GETPASS','username':"",'action':""},
					function (response) {

						//console.log(response);
					});

				break;
			}
		}


	}else if(document.activeElement.type=="text" || document.activeElement.type=="email" || document.activeElement.type=="number" ||  document.activeElement.type=="url"){

		for (var countElementsForm = 0; countElementsForm < document.activeElement.form.length; countElementsForm++) {
				if(document.activeElement.form.elements[countElementsForm].type=="password"){
					browser.runtime.sendMessage(
						{'CMD':'GETPASS','username':document.activeElement.value,'action':""},
						function (response) {

							//console.log(response);
						});
					break;
				}
			}

	}

}
