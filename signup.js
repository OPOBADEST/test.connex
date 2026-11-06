window.addEventListener("load", function () {
      setTimeout(function () {
        const preloader =
          document.getElementById("preloader");

        if (preloader) {
          preloader.classList.add("hide");
        }
      }, 1000);
    });


   
// PASSWORD SHOW / HIDE TOGGLE

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (!passwordInput) return;

        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";

        button.classList.toggle("showing", isHidden);

        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        button.setAttribute(
            "aria-pressed",
            String(isHidden)
        );

    });

});