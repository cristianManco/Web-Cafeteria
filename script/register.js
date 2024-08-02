const form = document.querySelector('#formRegister');
const userName = document.querySelector('#inputName');
const userEmail = document.querySelector('#inputEmail');
const userPassword = document.querySelector('#inputPassword');
const userPasswordConfirm = document.querySelector('#inputPasswordConfirm');
const userPhone = document.querySelector('#inputPhone');
const userGenre = document.querySelector('#selectGenre');
const botonRegistro = document.querySelector('#btnRegister');

// Selectores y variables globales
const URL = "https://coffeshop-backend.onrender.com/auth/register";
const URLBase = "https://coffeshop-backend.onrender.com/user/";

form.addEventListener("submit", (elemento) => {
  elemento.preventDefault();
  createUser();
});

async function createUser() {
  // Validar la información
  if (validatePassword()) {
    showAlert("La contraseña no es valida.");
    return;
  }
  
  // Validar que el email no esté registrado
  // if (await validateEmail()) {
  //   showAlert("El correo es invalido.");
  //   return;
  // }

  // Validador del tipo de sangre
  if (!bloodConfig()) {
    showAlert("No se seleccionó el genero.");
    return;
  }

  const user = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value,
    phone: userPhone.value,
    genre: userGenre.value,
  };

  try {
    // Crear al usuario
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);
    
    if (response.ok) {
      window.location.href = "./login.html";
      const token = data.access_token;
      console.log(token);
      const decodedToken = jwt_decode(token);
      const role = decodedToken.role;
      console.log(role);
      if (role === 'admin') {
        window.location.href = "../admin.html";
      } else {
        window.location.href = "./login.html";
      }
    } else {
      showAlert("Ocurrió un error al crear el usuario.");
    }

  } catch (error) {
    showAlert("Ocurrió un error al crear el usuario.");
  }
}

function showAlert(msg) {
  Swal.fire({
    title: "Error!",
    text: msg,
    icon: "error",
    showConfirmButton: false,
    timer: 4000,
    toast: true,
    position: "bottom-left",
  });
}

async function showHappy(success) {
  await Swal.fire({
    title: "Good job!",
    text: success,
    icon: "success",
  });
}

function validatePassword() {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){12,15}$/;

  // Validar que las dos contraseñas sean iguales, tengan una mínima longitud de 6 caracteres y tengan un carácter especial
  return userPassword.value === userPasswordConfirm.value && regex.test(userPassword.value);
}

function bloodConfig() {
  return userGenre.value !== "";
}

async function validateEmail() {
  try {
    const response = await fetch(`${URLBase}find/email/${userEmail.value}`);
    const data = await response.json();
    
    // Si data tiene elementos quiere decir que el email ya está registrado
    return data.length > 0;
  } catch (error) {
    return false;
  }
}
