window.onload = function() {
  var addButton = document.getElementsByTagName("BUTTON")[0];
  var submitButton = document.getElementsByTagName("BUTTON")[1];
  var inputs = document.getElementsByTagName("INPUT");
  var householdList = document.getElementsByClassName("household")[0];

  // The object where we will be storing information about the household.
  var household = {};

  // I changed button types to avoid form refresh on each click.
  addButton.type = "button";
  submitButton.type = "button";

  addButton.addEventListener("click", processInfo);
  submitButton.addEventListener("click", submitInfo);

  // NOTE TO SELF: Add EventListener on form to clear error reporting (if it exists) anytime the form is clicked? Or maybe a when the cursor is in the input field?

  // Driver of the program; adds the family member to the household if certain conditions are met, or reports an error back to the user if conditions are not met. 
  function processInfo() {
    if (errorCheck()) {
      addFamilyMember();
    } else {
      errorReport();
    };
  };

  // Validation logic for a family member's age.
  function errorCheck() {
    if (parseInt(inputs["age"].value) != NaN && (parseInt(inputs["age"].value) > 0)) {
      return true;
    } else {
      return false;
    };
  };

  // Outputs error messages to the user. Right now it is hardcoded for age validation, but it could be formatted to take an argument (like the name of the input field where the error occurred) for more dynamic reporting
  function errorReport() {
    var ageDiv = inputs["age"].parentNode.parentNode;
    var errorText = document.createElement('span');
    errorText.style.color = "red";
    errorText.id = "error";
    errorText.innerHTML = " Age must be a valid number.";
    ageDiv.appendChild(errorText);
  };

  // Clears error messages from the form.
  function clearError() {
    if (document.getElementById("error")) {
      var errorMsg = document.getElementById("error");
      errorMsg.parentNode.removeChild(errorMsg);
    };
  };

  // Driver of the program when user inputs 'good information'; sets up variables, calls functions to clear form, update data, and update the DOM.
  function addFamilyMember() {
    var age = inputs["age"].value;
    var relationship = document.getElementsByTagName("SELECT")[0].value;
    var smoker = inputs["smoker"].checked;
    var key = Object.keys(household).length.toString();

    clearForm();
    appendToHousehold(relationship, age, smoker, key);
    appendToList(relationship, age, smoker, key);
  };

  // Clears information from form. Only gets called in the 'good information' flow in the addFamilyMember() function.
  function clearForm() {
    // NOTE TO SELF: might change where this gets called.
    clearError();
    inputs["age"].value = "";
    document.getElementsByTagName("SELECT")[0].value = "";
    inputs["smoker"].checked = false;
  };

  // Adds data to household object. Only gets called in the 'good information' flow in the addFamilyMember() function
  function appendToHousehold(relationship, age, smoker, key) {
    household[key] = {"age":age, "rel":relationship, "smoker":smoker};
  }; 

  // Appends <ol> in the DOM with a new list item with the inputted information. Only gets called in the 'good information' flow in the addFamilyMember() function.
  function appendToList(relationship, age, smoker, key) {
    var li = document.createElement("LI");
    var text = returnTextForFamilyMember(relationship, age, smoker);
    li.appendChild(text);
    li.appendChild(createRemoveLink(key));
    householdList.appendChild(li);
  };

  // Factors out complexity of reporting back family member smoking status. Called by the appendToList() function.
  function returnTextForFamilyMember(relationship, age, smoker) {
    if (smoker) {
      var text = document.createTextNode(relationship + ", " + age + ", smoker ");
    } else {
      var text = document.createTextNode(relationship + ", " + age + ", non-smoker ");
    }
    return text;
  };

  // Sets up the information contained in a link to remove a family member.
  function createRemoveLink(key) {
    var removeLink = document.createElement('a');
    var linkText = document.createTextNode("Remove family member");
    removeLink.appendChild(linkText);
    removeLink.href = "#";
    removeLink.classList.add("remove");
    removeLink.id = key;
    removeLink.addEventListener('click', removeFamilyMember);
    return removeLink;
  };

  // Removes a given family member from the household object. Called via a click EventListener on each remove link in the <ol>
  function removeFamilyMember() {
    delete household[this.id];
    var liToRemove = document.getElementById(this.id).parentNode;
    liToRemove.parentNode.removeChild(liToRemove);
  }

  // Places serialized JSON of the household object into the <pre class="debug"> element in the DOM. In production, this would likely be placed by an AJAX request to the server. 
  function submitInfo() {
    var container = document.getElementsByClassName("debug")[0];
    container.innerHTML = JSON.stringify(household);
    container.style.display = "block";
  }
}