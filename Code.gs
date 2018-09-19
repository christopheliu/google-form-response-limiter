var scriptProperty = PropertiesService.getScriptProperties();

//state describes whether response limit has been set or not
function setState(state) {
  scriptProperty.setProperty('state',state);
}

function getState() {
  return scriptProperty.getProperty('state');
}

//value is the latest response limit set by editor
function setValue(result) {
  scriptProperty.setProperty('limit',result);
}

function getValue() {
  return scriptProperty.getProperty('limit');
}

//menu creation
function onOpen() {  
  FormApp.getUi()
  .createMenu('Response Limit')
  .addItem('Set response limit','setLimit')
  .addItem('Check response limit','checkLimit')
  .addItem('Remove response limit','removeLimit')
  .addToUi();
}

//trigger response condition check when user submit form
function submitTrigger() {
  var id = FormApp.getActiveForm().getId();
  var form = FormApp.openById(id);
  ScriptApp.newTrigger('onSubmit')
  .forForm(form)
  .onFormSubmit()
  .create();
}


//when user submit form, checks response limit condition
function onSubmit() {
  if (getState() == 1){
    responseLimit();
  }
}

function setLimit() {
  submitTrigger();
  setState(1);
  
  var ui = FormApp.getUi(); 
  var id = FormApp.getActiveForm().getId();
  var form = FormApp.openById(id);
  var result;
  
  do {
    result =  ui.prompt("Please enter number of desired responses:").getResponseText();
  }while (result < 1 || isNaN(parseInt(result,10)));
  
  setValue(result);
  responseLimit();
  ui.alert("You entered:"+getValue()+"\nCurrent form responses:"+form.getResponses().length+"\nCurrent form Acceptance Status:"+form.isAcceptingResponses());
}

function checkLimit() {
  var ui = FormApp.getUi(); 
  var id = FormApp.getActiveForm().getId();
  var form = FormApp.openById(id);
  //check if editor have set limit or not
  if (getState() == 1){
    ui.alert("Response limit:"+getValue()+"\nCurrent form responses:"+form.getResponses().length+"\nCurrent form Acceptance Status:"+form.isAcceptingResponses());
  } else {
    ui.alert("Response limit: none \nCurrent form responses:"+form.getResponses().length+"\nCurrent form Acceptance Status:"+form.isAcceptingResponses());
  }
}

function removeLimit() {
  setState(0);
  var ui = FormApp.getUi(); 
  var id = FormApp.getActiveForm().getId();
  var form = FormApp.openById(id);
  form.setAcceptingResponses(true);
}

function responseLimit() {
  var id = FormApp.getActiveForm().getId();
  var form = FormApp.openById(id);
  var responses = form.getResponses();
  /*var msg = "contact me";*/
  
  if(responses.length >= getValue()) {
    /*form.setAcceptingResponses(false).setCustomClosedFormMessage(msg);*/
    form.setAcceptingResponses(false);
  } else {
    //when form editor increases the limit
    form.setAcceptingResponses(true);
  }  
  
}