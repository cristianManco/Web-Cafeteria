document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const loginItem = document.getElementById("loginItem");
  const registerItem = document.getElementById("registerItem");
  const logoutItem = document.getElementById("logoutItem");
  const logoutLink = document.getElementById("logoutLink");

  const protectedPages = ["productos1.html", "eventos.html", "contacto.html", "prueba.html"];

  // Función para redirigir si no hay token o si es inválido
  function redirectToLogin() {
      window.location.href = "../Auth/login.html";
  }

  // Verificar si la página actual está protegida
  function isProtectedPage() {
      const currentPage = window.location.pathname.split("/").pop();
      return protectedPages.includes(currentPage);
  }

  if (!token) {
      if (isProtectedPage()) {
          redirectToLogin();
      }
  } else {
      try {
          const payload = await jwt_decode(token);
          const now = Math.floor(Date.now() / 1000);

          if (payload.exp < now) {
              localStorage.removeItem("token");
              if (isProtectedPage()) {
                  redirectToLogin();
              }
          } else {
              // Mostrar opción de logout si el token es válido
              loginItem.style.display = "none";
              registerItem.style.display = "none";
              logoutItem.style.display = "block";

              // Agregar evento de logout
              logoutLink.addEventListener("click", function() {
                  localStorage.removeItem("token");
                  window.location.href = "../index.html";
              });
          }
      } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          if (isProtectedPage()) {
              redirectToLogin();
          }
      }
  }
});
