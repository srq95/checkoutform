// Error Handler

function errorHandler(errorMsg = "") {
  document.getElementById("error-box").innerHTML = errorMsg
    ? `<p>${errorMsg}</p>`
    : "";
}

// Error Handler For All Inputs

let lengthErrors = [];
let typeErrors = [];

const allInputs = document.querySelectorAll(".detailsInput input");

allInputs.forEach((el) =>
  el.addEventListener("input", (event) => {
    inputErrorHandler(event.target);
  })
);

function inputErrorHandler(input) {
  let type = input.getAttribute("data-type");
  let maxLength = input.getAttribute("data-maxlength");

  function checkRemove(pushTo, value) {
    pushTo.includes(value) ? pushTo.splice(pushTo.indexOf(value), 1) : null;
  }

  function checkAdd(pushTo, value) {
    pushTo.includes(value) ? null : pushTo.push(value);
  }

  if (type || maxLength) {
    let nameInput = input.getAttribute("placeholder");

    if (maxLength) {
      if (maxLength < input.value.length) {
        checkAdd(lengthErrors, nameInput);
      } else {
        checkRemove(lengthErrors, nameInput);
      }
    }

    if (type) {
      let number = new RegExp("^[0-9]+$");
      let alphabetic = new RegExp("^[a-zA-Z]+$");
      if (type == "number") {
        if (number.test(input.value)) {
          checkRemove(typeErrors, nameInput);
        } else {
          checkAdd(typeErrors, nameInput);
        }
      }
      if (type == "alphabetic") {
        if (alphabetic.test(input.value)) {
          checkRemove(typeErrors, nameInput);
        } else {
          checkAdd(typeErrors, nameInput);
        }
      }
    }

    let errorMsg = "";
    if (typeErrors.length) {
      errorMsg +=
        typeErrors.join(", ") +
        ` ${typeErrors.length > 1 ? "are" : "is"} in valid`;
    }

    if (typeErrors.length && lengthErrors.length) {
      errorMsg += "<br>";
    }

    if (lengthErrors.length) {
      errorMsg += lengthErrors.join(", ") + " have exceeded length";
    }
    if (lengthErrors.length || typeErrors.length) {
      errorHandler(errorMsg);
    } else {
      errorHandler();
    }
  }
}

// Remove Alphabets

function removeAlphabet(input) {
  return input.value.replace(/\D/g, "");
}

// Credit Card Type

function creditCardType(cc) {
  let amex = new RegExp("^3[47]\\d{0,13}");
  let visa = new RegExp("^4\\d{0,15}");
  let cup1 = new RegExp("^62\\d{0,14}");
  let cup2 = new RegExp("^81\\d{0,14}");

  let mastercard = new RegExp(
    "^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}"
  );

  let discover = new RegExp("^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}");

  let diners = new RegExp("^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}");
  let jcb = new RegExp("^(?:35\\d{0,2})\\d{0,12}");
  let jcb1 = new RegExp("^(?:2131|1800)\\d{0,11}");

  if (visa.test(cc)) {
    return "visa";
  }
  if (amex.test(cc)) {
    return "amex";
  }
  if (mastercard.test(cc)) {
    return "mastercard";
  }
  if (discover.test(cc)) {
    return "discover";
  }
  if (diners.test(cc)) {
    return "diners";
  }
  if (jcb.test(cc) || jcb1.test(cc)) {
    return "jcb";
  }
  if (cup1.test(cc) || cup2.test(cc)) {
    return "unionpay";
  }
  return undefined;
}

// BackSpace Handler

function backspaceHandle(input, e, goBackTo) {
  if (e.key === "Backspace") {
    if (input.value.length === 0) {
      const creditCardInput = document.getElementById(goBackTo);
      creditCardInput.focus();
    }
    return;
  } else {
    return;
  }
}

// Credit Card Formater

function formatCreditCardNumber(input) {
  let value = removeAlphabet(input);

  let type = creditCardType(value);

  function removeClass() {
    let allTypes = ["paypal", "discover", "visa", "amex", "mastercard"];
    for (let i = 0; i < allTypes.length; i++) {
      document.getElementById("cardInputArea").classList.remove(allTypes[i]);
    }
  }

  removeClass();

  if (type) {
    document.getElementById("cardInputArea").classList.add(type);
  }

  value = value.slice(0, 16);

  value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

  input.value = value;

  if (value.length === 19) {
    document.getElementById("exp-date").focus();
  }
}

const creditCardNumberInput = document.getElementById("cardnumber");

creditCardNumberInput.addEventListener("input", (event) => {
  formatCreditCardNumber(event.target);
});

// Expiry Date Formater

function formatExpiryDate(input) {
  let value = removeAlphabet(input);
  value = value.slice(0, 4);
  if (value.length > 0) {
    if (value.charAt(0) > "1") {
      value = `0${value.charAt(0)}/${value.slice(1)}`;
    } else {
      value = value.replace(/(\d{2})(?=\d)/g, "$1/");
    }
  }

  const month = parseInt(value.slice(0, 2));
  const year = value.slice(2);
  if (month > 12) {
    value = `12/${year}`;
  }

  input.value = value;
  if (value.length === 5) {
    document.getElementById("cvc").focus();
  }
}

const expiryDateInput = document.getElementById("exp-date");

expiryDateInput.addEventListener("keyup", (event) => {
  backspaceHandle(event.target, event, "cardnumber");
});

expiryDateInput.addEventListener("input", (event) => {
  formatExpiryDate(event.target, event);
});

// Expiry CVC Formater

function formatCVC(input) {
  let value = removeAlphabet(input);
  value = value.slice(0, 3);
  input.value = value;
}

const CVCInput = document.getElementById("cvc");

CVCInput.addEventListener("keyup", (event) => {
  backspaceHandle(event.target, event, "exp-date");
});

CVCInput.addEventListener("input", (event) => {
  formatCVC(event.target, event);
});

// IntlTelInput Phone Number

var input = document.querySelector("#phone");
window.intlTelInput(input, {
  initialCountry: "auto",
  geoIpLookup: function (callback) {
    $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
      var countryCode = resp && resp.country ? resp.country : "";
      callback(countryCode);
    });
  },
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.min.js", // just for formatting/placeholders etc
});
