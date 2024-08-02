document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      // Redirigir a la página de login si no hay token
      window.location.href = "../Auth/login.html";
    } else {
      try {
        // Decodificar el token para verificar su validez
        const payload = jwt_decode(token);
        const now = Math.floor(Date.now() / 1000);
  
        // Verificar si el token ha expirado
        if (payload.exp < now) {
          // El token ha expirado, redirigir a la página de login
          localStorage.removeItem("token");
          window.location.href = "../Auth/login.html";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Token no válido, redirigir a la página de login
        localStorage.removeItem("token");
        window.location.href = "../Auth/login.html";
      }
    }
});
  

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const loginItem = document.getElementById("loginItem");
    const registerItem = document.getElementById("registerItem");
    const logoutItem = document.getElementById("logoutItem");
    const logoutLink = document.getElementById("logoutLink");

    if (token) {
        try {
            const payload = jwt_decode(token);
            const now = Math.floor(Date.now() / 1000);

            if (payload.exp >= now) {
                // Mostrar opción de logout si el token es válido
                loginItem.style.display = "none";
                registerItem.style.display = "none";
                logoutItem.style.display = "block";

                // Agregar evento de logout
                logoutLink.addEventListener("click", function() {
                    localStorage.removeItem("token");
                    window.location.href = "index.html";
                });
            } else {
                // El token ha expirado, eliminarlo
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("token");
        }
    } else {
        // Mostrar opciones de login y register si no hay token
        loginItem.style.display = "block";
        registerItem.style.display = "block";
        logoutItem.style.display = "none";
    }
});
