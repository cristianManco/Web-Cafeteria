document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("formLogin");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;

    try {
      const response = await fetch("https://coffeshop-backend.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.data.access_token;
        if (!token) {
          throw new Error("Token not provided");
        }

        try {
          const payload = jwt_decode(token);

          localStorage.setItem("token", token);

          switch (payload.role) {
            case "admin":
              window.location.href = "../admin.html";
              break;
            case "user":
              window.location.href = "../productos1.html";
              break;
            default:
              Swal.fire("Error", "Role not recognized", "error");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          Swal.fire("Error", "Invalid token", "error");
        }
      } else {
        Swal.fire("Error", data.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire("Error", "An error occurred during login", "error");
    }
  });
});
