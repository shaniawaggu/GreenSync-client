document.getElementById("sign-up-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: form.get("username"),
            email: form.get("email"),
            password: form.get("password"),
            postcode: form.get("postcode")
        })
    }
    console.log(options)
    const response = await fetch("http://131.145.0.127:3000/user/register", options);
    const data = await response.json();

    if (response.status == 201) {
        window.location.assign("login.html");
    } else {
        alert(data.error);
    }
})