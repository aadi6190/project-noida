document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const contactTableBody = document.getElementById("contactTableBody");
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const popup = document.getElementById("popup");
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const cancelDeleteButton = document.getElementById("cancelDelete");
    const contactCard = document.querySelector(".contact-card");
    const cardElements = {
      name: document.getElementById("cardName"),
      address: document.getElementById("cardAddress"),
      number: document.getElementById("cardNumber"),
      createdOn: document.getElementById("cardCreatedOn"),
      status: document.getElementById("cardStatus"),
      notes: document.getElementById("cardNotes"),
      image: document.getElementById("cardImage"),
    };
  
    let currentRow = null;
    let uploadedImage = "";
  
    // Update contact card with data
    const updateCard = (data) => {
      cardElements.name.textContent = data.Name;
      cardElements.address.textContent = data.Address;
      cardElements.number.textContent = data.Number;
      cardElements.createdOn.textContent = data.CreatedOn;
      cardElements.status.textContent = data.Status;
      cardElements.notes.textContent = data.Notes;
      cardElements.image.src = data.ContactPic;
    };
  
    // Populate form fields with data
    const populateFormFields = (data) => {
      Object.keys(data).forEach((key) => {
        if (contactForm.elements[key.toLowerCase()]) {
          contactForm.elements[key.toLowerCase()].value = data[key];
        }
      });
      uploadedImage = data.ContactPic;
      submitButton.textContent = "Update";
    };
  
    // Handle row click
    const handleRowClick = (row) => {
      const cells = row.querySelectorAll("td");
      const data = {
        Name: cells[2].innerHTML.split("<br>")[0],
        Address: cells[2].innerHTML.split("<br>")[1],
        Number: cells[3].textContent,
        CreatedOn: cells[4].textContent,
        Status: cells[5].textContent,
        Notes: cells[6].textContent,
        ContactPic: cells[1].querySelector("img").src,
      };
      updateCard(data);
      populateFormFields(data);
      currentRow = row;
    };
  
    // Add or update row
    const addOrUpdateRow = (data) => {
      if (currentRow) {
        const cells = currentRow.querySelectorAll("td");
        cells[1].querySelector("img").src = data.ContactPic;
        cells[2].innerHTML = `${data.Name}<br>${data.Address}`;
        cells[3].textContent = data.Number;
        cells[4].textContent = data.CreatedOn;
        cells[5].textContent = data.Status;
        cells[6].textContent = data.Notes;
      } else {
        addNewRow(data);
      }
      contactForm.reset();
      uploadedImage = "";
      submitButton.textContent = "Submit";
      currentRow = null;
    };
  
    // Add new row
    const addNewRow = (data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="rowCheckbox"></td>
        <td><img src="${data.ContactPic}" alt="Contact Pic"></td>
        <td>${data.Name}<br>${data.Address}</td>
        <td>${data.Number}</td>
        <td>${data.CreatedOn}</td>
        <td>${data.Status}</td>
        <td>${data.Notes}</td>
        <td><button class="deleteRowButton"><i class="fa-solid fa-trash"></i></button></td>
      `;
      contactTableBody.appendChild(row);
      row.querySelector(".deleteRowButton").addEventListener("click", (e) => {
        e.stopPropagation();
        showDeletePopup(() => row.remove());
      });
      row.addEventListener("click", () => handleRowClick(row));
    };
  
    // Submit form
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const data = {
        Name: formData.get("name"),
        Address: formData.get("address"),
        Number: formData.get("number"),
        CreatedOn: formData.get("createdOn"),
        Status: formData.get("status"),
        Notes: formData.get("notes"),
        ContactPic: uploadedImage || "default-pic.jpg",
      };
      addOrUpdateRow(data);
      toggleContactCard(true);
    });
  
    // Handle image upload
    contactForm.querySelector('input[name="attachment"]').addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Select all checkboxes
    document.getElementById("selectAll").addEventListener("change", (e) => {
      document.querySelectorAll(".rowCheckbox").forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
  
    // Show delete popup
    const showDeletePopup = (onConfirm) => {
      popup.style.display = "flex";
      confirmDeleteButton.onclick = () => {
        onConfirm();
        popup.style.display = "none";
      };
      cancelDeleteButton.onclick = () => {
        popup.style.display = "none";
      };
    };
  
    // Toggle contact card visibility
    const toggleContactCard = (isVisible) => {
      contactCard.style.display = isVisible ? "block" : "none";
    };
  
    // Navigation menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  });
  