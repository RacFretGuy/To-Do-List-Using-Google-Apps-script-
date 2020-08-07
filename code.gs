var sheetName='tag_data';
var EMAIL_INDEX = 1;
var TAG_INDEX = 2;
var CREATED_DATE_INDEX = 3;
var UPDATED_DATE_INDEX = 4;
var COMPLETED_DATE_INDEX = 5;
var TAG_TYPE_INDEX=6;
var sheetDateFormat = 'MM/dd/yyyy HH:mm:ss';

function doGet(){
  status = isAuthorized(Session.getActiveUser().getEmail(), 'Details', 'a');
  if(status){
    return HtmlService.createTemplateFromFile("ToDo").evaluate();
  }
  else{ 
    return HtmlService.createTemplateFromFile("Error").evaluate(); 
    
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


function isAuthorized(email, sheetName, column) {
  console.log("Authorizing email: " + email);
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var column = sheet.getRange(column.toUpperCase()+":"+column.toUpperCase());
  var values = column.getValues();
  var status = values.filter(function(value) {
    return value[0] === email; 
  });
  return status.length > 0;
}

function getData(){
    var todoArr = []; 
    var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

    for(var i=1;i<=sheet.getDataRange().getValues().length;i++){
      if(sheet.getRange(i, 1).getValue() == Session.getActiveUser().getEmail()){
        var todo= new Object();
        todo.id=i;
        todo.tag=sheet.getRange(i, TAG_INDEX).getValue();
        todo.createdDate=sheet.getRange(i, CREATED_DATE_INDEX).getDisplayValue();
        todo.completedDate=sheet.getRange(i, COMPLETED_DATE_INDEX).getDisplayValue();
        todo.updatedDate=sheet.getRange(i, UPDATED_DATE_INDEX).getDisplayValue();
        todo.tagType = sheet.getRange(i, TAG_TYPE_INDEX).getDisplayValue();
        todoArr.push(todo);
      }
    }
    console.log(todoArr);
    return todoArr;
}

function createNewTag(tag, tagType) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  Logger.log("Creating goal for tag: " + tag + "and type: " + tagType);
  sheet = sheet.appendRow([Session.getActiveUser().getEmail(),tag, new Date(),'','',tagType]);
  var i = sheet.getLastRow();
  var todo= new Object();
  todo.id=i;
  todo.tag=sheet.getRange(i, TAG_INDEX).getValue();
  todo.createdDate=sheet.getRange(i, CREATED_DATE_INDEX).getDisplayValue();
  todo.completedDate=sheet.getRange(i, COMPLETED_DATE_INDEX).getDisplayValue();
  todo.updatedDate=sheet.getRange(i, UPDATED_DATE_INDEX).getDisplayValue();
  todo.tagType = sheet.getRange(i, TAG_TYPE_INDEX).getDisplayValue();
  Logger.log("goal created is is: " + todo);

  return todo;
}

function completeTask(id) {
  console.log("Completing task for id: "+ id);
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if(Session.getActiveUser().getEmail()==sheet.getRange(id,EMAIL_INDEX).getValue()){
    var now = new Date();
    sheet.getRange(id,COMPLETED_DATE_INDEX).setValue(now).setNumberFormat(sheetDateFormat);
  }
}



function updateTag(id, updatedTag){
  console.log("Updating tag for id: " + id + "with updated value: " + updatedTag);
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if(sheet.getRange(id, EMAIL_INDEX).getValue() == Session.getActiveUser().getEmail()){
   if(sheet.getRange(id, TAG_INDEX).getValue()==updatedTag){
     return;
   } else {
     sheet.getRange(id,TAG_INDEX).setValue(updatedTag);
     sheet.getRange(id, UPDATED_DATE_INDEX).setValue(new Date()).setNumberFormat(sheetDateFormat);
   }
  }
}

