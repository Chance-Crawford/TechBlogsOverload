// file that requests for new user sessions, logs in users, and registers
// new users
async function loginHandler(event){
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(username && password){
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            // if user was logged in successfully, create a session
            // and take them to the user dashboard.
            document.location.replace('/dashboard');
        } else {
          alert(response.statusText);
        }
    }
}

async function signupHandler(event){
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if(username && password){
        if(password.length < 6){
            alert('Password must be 6 or more characters');
            return;
        }

        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            // if user was logged in successfully, create a session
            // and take them to the user dashboard.
            document.location.replace('/dashboard');
        } else {
          alert(response.statusText);
        }
    }
}

// listen for form submits
document.querySelector('.login-form').addEventListener('submit', loginHandler)
document.querySelector('.signup-form').addEventListener('submit', signupHandler)