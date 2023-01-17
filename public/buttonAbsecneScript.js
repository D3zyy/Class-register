document.addEventListener('DOMContentLoaded', () => {
    const addNameButton = document.querySelector('button[onclick="addName()"]');
    const selectElement = document.querySelector('select');
    const formElement = document.querySelector('form[name="myForm"]');
  
    
  
    // Set the display and vertical-align styles of the select element
    selectElement.style.display = 'inline-block';
    selectElement.style.verticalAlign = 'top';
  
    // Set the display and vertical-align styles of the addNameButton
    addNameButton.style.display = 'inline-block';
    addNameButton.style.verticalAlign = 'top';
    addNameButton.style.marginLeft = '10px';
  
    // Show or hide the addNameButton based on the number of options in the select element
    if (selectElement.options.length > 0) {
      addNameButton.style.display = 'inline-block';
    } else {
      addNameButton.style.display = 'none';
    }
  
    addNameButton.addEventListener('click', (event) => {
      event.preventDefault();
      // The rest of the code goes here
      const selectedOption = selectElement.options[selectElement.selectedIndex];
  
      // Create a new element to display the selected value
      const newElement = document.createElement('div');
      newElement.textContent = `${selectedOption.textContent}`;
      newElement.insertAdjacentHTML('beforeend', ' <button>-</button>');
      newElement.setAttribute('data-value', selectedOption.value);
  
      // Insert the new element after the addNameButton
      addNameButton.parentNode.insertBefore(newElement, addNameButton.nextSibling);
  
      // Create a hidden input element for the selected option
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "selectedOption");
      input.setAttribute("value", selectedOption.value);
      formElement.appendChild(input);
  
      // Remove the selected option from the select element
      selectElement.options.remove(selectElement.selectedIndex);
  
      // Show or hide the addNameButton based on the number of options in the select element
      if (selectElement.options.length > 0) {
        addNameButton.style.display = 'inline-block';
      } else {
        addNameButton.style.display = 'none';
      }
  
      // Add a persistent event listener to the "-" button
      const removeButton = newElement.querySelector('button');
      removeButton.addEventListener('click', (event) => {
        event.preventDefault();
        // Remove the parent element of the button (the div containing the name and the button)
        removeButton.parentNode.remove();
  
        // Remove the corresponding hidden input from the form
        input.remove();
  
        // Add the option back to the select element
      // Add the option back to the select element
       const value = newElement.getAttribute('data-value');
        const text = newElement.textContent.substring(0, newElement.textContent.length - 1);
        const option = new Option(text, value);
        selectElement.options.add(option);
  
        // Show or hide the addNameButton based on the number of options in the select element
        if (selectElement.options.length > 0) {
          addNameButton.style.display = 'inline-block';
        } else {
          addNameButton.style.display = 'none';
        }
      });
    });
  });
  
  
  document.getElementById("entry").onsubmit = function(){
      document.getElementById("message").innerHTML = "Form submitted successfully";
      document.getElementById("message").style.display = "block";
      return false;
  }
  