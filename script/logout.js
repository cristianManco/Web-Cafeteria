Selectores
 const cerrarSesion = document.querySelector("#btnSalir");
 const saludoUser = document.getElementById('saludoUser');


cerrarSesion.addEventListener("click", () => {
     localStorage.removeItem("isAuthenticated")
     window.location.href = "./index.html"

 })