const rootURL = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
let apiKey = "Fetching key";
let statusMessage = document.getElementById("statusMessageCard");
let fetchTries = 1;

fetchAPIKey()

function menuButtonClick(x){
  if (x === 1) {
    containerStart.style.display = "none";
    containerBookList.style.display = "block";
    containerAddBooks.style.display = "none";
    getListOfBooks(fetchTries);
  }
  else if (x === 2) {
    containerStart.style.display = "none";
    containerBookList.style.display = "none";
    containerAddBooks.style.display = "block";
  }
}

function getListOfBooks(fetchTries) {
  let list = document.getElementById("dynamicListOfBooks");

  while(list.firstChild){
      list.removeChild(list.firstChild);
  }

  fetch(rootURL + "op=select&key=" + apiKey)
  .then((response) => response.json())
  .then((responseData) => {
    populateBooks(responseData, fetchTries);
  });
}            

function populateBooks (responseData, fetchTries) {
  if (responseData.status == "error") {
    if (fetchTries >= 10) {
      statusMessage.innerHTML = "Ten failed attempts to make booklist";
    }
    else{
      getListOfBooks(fetchTries + 1);
    }
  }
  else{
    let tableBody = document.getElementById("dynamicListOfBooks");
    for (let i = 0; i < responseData.data.length; i++) {
      let tr = "<tr>"
      tr += "<td class=tableID>" + responseData.data[i].id + "</td>" + "<td class=tableAuthor>" + responseData.data[i].author + "</td>" + "<td class=tableTitle>" + responseData.data[i].title + "</td>" + 
        "<td>" + "<input type='button' value='Delete' onclick='deleteRow("+i+")'/></td>" + "<td>" + "<input type='button' value='Edit' onclick='editRow("+i+")'/></td>";
      tableBody.innerHTML += tr;

      statusMessage.innerHTML = "Updated book successfully"
    }
  }
}

function fetchAPIKey(){
  let showAPIKey = document.getElementById("keyResult");
  fetch(rootURL + "requestKey")
  .then((response) => response.json())
  .then((responseData) => {showAPIKey.innerHTML = "This is your API key: " + responseData.key; apiKey = responseData.key});
}

function saveButton(fetchTries) {
  let saveAuthor = document.getElementById("authorInput").value;
  let saveTitle = document.getElementById("titleInput").value;

  if (saveTitle !== "" && saveAuthor !== "") {
    fetch(rootURL + "op=insert&key=" + apiKey + "&title=" + saveTitle + "&author=" + saveAuthor)
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.status == "error") {
        if (fetchTries >= 10) {
          statusMessage.innerHTML = "Ten fails attempts to save your last book";
        }
        else{
          saveButton(fetchTries + 1);
        }
      }
      else{
        document.getElementById("titleInput").value = "";
        document.getElementById("authorInput").value = "";
        statusMessage.innerHTML = "Last entry was successful";
      }
    });
  }
  else {
    statusMessage.innerHTML = "Missing field";
  }
}

function deleteRow(i) {
  let idOfBook = document.getElementById("dynamicListOfBooks").rows[i].cells[0].innerHTML;

  fetch(rootURL + "op=delete&key=" + apiKey + "&id=" + idOfBook)
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.status == "error") {
        if (fetchTries >= 10) {
          statusMessage.innerHTML = "Ten failed attempts to delete book";
        }
        else{
          deleteRow(i, fetchTries + 1);
        }
      }
      else{ 
        statusMessage.innerHTML = "Deleted book successfully"
        getListOfBooks(fetchTries);
      }
  });
}

function editRow(i){
  let idOfBook = document.getElementById("dynamicListOfBooks").rows[i].cells[0].innerHTML;
  let authorEdit = document.getElementById("dynamicListOfBooks").rows[i].cells[1].innerHTML;
  let titleEdit = document.getElementById("dynamicListOfBooks").rows[i].cells[2].innerHTML;
  var authorPrompt = prompt('Edit author', authorEdit);
  var titlePrompt = prompt('Edit title', titleEdit);

  if(authorPrompt == null || authorPrompt == ''){
    statusMessage.innerHTML = 'Cancelled edit or empty box. Try again';
  }
  else if( titlePrompt == null || titlePrompt == ''){
    statusMessage.innerHTML = 'Cancelled edit or empty box. Try again';
  }
  else{
    tryUpload(authorPrompt, titlePrompt, idOfBook, fetchTries)
  }  
}

function tryUpload(authorPrompt, titlePrompt, idOfBook, fetchTries){
  fetch(rootURL + "op=update&key=" + apiKey + "&id=" + idOfBook + "&title=" + titlePrompt + "&author=" + authorPrompt)
  .then((response) => response.json())
  .then((responseData) => {
    if (responseData.status == "error") {
      if (fetchTries >= 10) {
        statusMessage.innerHTML = "Ten failed attempts to delete book";
      }
      else{
        tryUpload(authorPrompt, titlePrompt, idOfBook, fetchTries + 1);
      }
    }
    else{
      getListOfBooks(fetchTries);
    }
  });
}

document.getElementById("updateButton").addEventListener("click", function() {
  getListOfBooks(fetchTries);
}); 

document.getElementById("saveButton").addEventListener("click", function() {
  saveButton(fetchTries);
});

document.getElementById("authorInput").onfocus = function() {
  let sender = document.getElementById("authorInput");
  changeColorOnFocus(sender)
};

document.getElementById("authorInput").onblur = function() {
  let sender = document.getElementById("authorInput");
  changeColorOnBlur(sender)
};

document.getElementById("titleInput").onfocus = function() {
  let sender = document.getElementById("titleInput");
  changeColorOnFocus(sender)
};

document.getElementById("titleInput").onblur = function() {
  let sender = document.getElementById("titleInput");
  changeColorOnBlur(sender)
};

function changeColorOnFocus(sender){
  sender.style.backgroundColor = "#E0FFFF";
}
function changeColorOnBlur(sender){
  sender.style.backgroundColor = "white";
}

window.onload = function(){
  containerStart.style.display = "block";
  containerBookList.style.display = "none";
  containerAddBooks.style.display = "none";
  document.getElementById("keyResult").innerHTML = apiKey;
}
