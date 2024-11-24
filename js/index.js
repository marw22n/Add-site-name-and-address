var nameInputId = "siteNameInput";
var urlInputId = "siteURLInput";
var submitButtonId = "submitBookmarkBtn";
var tableBodyId = "bookmarkTableContent";
var closeButtonId = "closeModalBtn";
var modalId = ".info-modal";

var nameInput = document.getElementById(nameInputId);
var urlInput = document.getElementById(urlInputId);
var submitButton = document.getElementById(submitButtonId);
var tableBody = document.getElementById(tableBodyId);
var closeButton = document.getElementById(closeButtonId);
var modal = document.querySelector(modalId);

var bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (var i = 0; i < bookmarks.length; i++) {
    displayBookmark(i);
  }
}

function displayBookmark(index) {
  var bookmark = bookmarks[index];
  var url = bookmark.siteURL;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  var newRow = `
    <tr>
      <td>${index + 1}</td>
      <td>${bookmark.siteName}</td>
      <td><button class="btn-visit" data-index="${index}">Visit</button></td>
      <td><button class="btn-delete" data-index="${index}">Delete</button></td>
    </tr>
  `;
  tableBody.innerHTML += newRow;

  var deleteButtons = document.querySelectorAll(".btn-delete");
  var visitButtons = document.querySelectorAll(".btn-visit");

  deleteButtons.forEach(function(button) {
    button.addEventListener("click", deleteBookmark);
  });

  visitButtons.forEach(function(button) {
    button.addEventListener("click", visitBookmark);
  });
}

function clearInputFields() {
  nameInput.value = "";
  urlInput.value = "";
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

submitButton.addEventListener("click", function() {
  var name = nameInput.value;
  var url = urlInput.value;

  if (name && url) {
    var newBookmark = {
      siteName: capitalizeFirstLetter(name),
      siteURL: url
    };

    bookmarks.push(newBookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
    displayBookmark(bookmarks.length - 1);
    clearInputFields();
  } else {
    modal.classList.remove("d-none");
  }
});

function deleteBookmark(event) {
  var index = event.target.dataset.index;
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  tableBody.innerHTML = "";
  for (var i = 0; i < bookmarks.length; i++) {
    displayBookmark(i);
  }
}

function visitBookmark(event) {
  var index = event.target.dataset.index;
  var url = bookmarks[index].siteURL;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  window.open(url);
}

var nameRegex = /^[A-Za-z\s]{3,}$/;
var urlRegex = /^(https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,6}(\/[\w-]*)*$/;

nameInput.addEventListener("input", function() {
  validateInput(nameInput, nameRegex);
});

urlInput.addEventListener("input", function() {
  validateInput(urlInput, urlRegex);
});

function validateInput(input, regex) {
  if (regex.test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
  }
}

function closeModal() {
  modal.classList.add("d-none");
}

closeButton.addEventListener("click", closeModal);

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function(e) {
  if (e.target === modal) {
    closeModal();
  }
});
