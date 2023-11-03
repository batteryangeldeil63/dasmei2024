function createErrorMessage(input, error) {
  //cria mensagens de erro referente aos INPUTS;
  const ErrorMessage = document.createElement("div");
  ErrorMessage.classList.add("divMessage");
  ErrorMessage.innerHTML = error ? error : "Por favor preencha todos os campos";
  ErrorMessage.style.opacity = 0; 
  ErrorMessage.style.transform = "translateY(-1rem)";
  ErrorMessage.style.animation = "ErrorMessageAnimation 0.1s forwards";
  ErrorMessage.style.color = "red";
  ErrorMessage.style.fontSize = "1.6rem";
  ErrorMessage.style.position = "absolute";
  ErrorMessage.style.bottom = "-1rem";

  if(input) {
    input.style.borderBottom = `1px solid red`;
    if(!input.querySelector(".divMessage")) {
      input.appendChild(ErrorMessage);
    }
  }

  return ErrorMessage;
}

function createAlert(error) {
  //cria mensagens referentes ao login/cadastro;
  const ErrorMessage = createErrorMessage();
  ErrorMessage.innerHTML = error ? error : "Nao foi posível cadastrar";
  ErrorMessage.style.position = "absolute";
  ErrorMessage.style.top = window.innerWidth >= 1000 ? "15%" : "1%";
  ErrorMessage.style.width = "100%";
  ErrorMessage.style.textAlign = "center";
  ErrorMessage.style.animation = "ErrorMessageAnimation 0s forwards";

  const form = document.querySelector(".form-modal");
  if(!form.querySelector(".divMessage")) {
    form.insertBefore(ErrorMessage, form.firstChild);
  }
}

function removeErrorMessage(input) {
  const error = document.querySelector(".divMessage");
  const alert = document.querySelector(".form-modal .divMessage");

  input.style.borderBottom = `1px solid black`;
  
  if(error) {
    error.remove();
  }

  if(alert) {
    alert.remove();
  }
}

export { createErrorMessage, createAlert, removeErrorMessage };