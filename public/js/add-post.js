// capture user input and add post to database
async function postHandler(event){
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const post_text = document.querySelector('#post-body').value.trim();

    if(title && post_text){
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                post_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } 
}

// listener for submit on post form.
document.querySelector('#post-form').addEventListener('submit', postHandler);