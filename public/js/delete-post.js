// capture user input and add post to database
async function deleteHandler(event){
    event.preventDefault();

    // checks to make sure that the element clicked
    // was a delete button by checking for a custom data attribute.
    if(event.target.getAttribute("data-post")){
        const id = event.target.getAttribute("data-post");

        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });

        // check if delete request was successful
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } 
}

// listener for the container of all the users posts.
// we need to use the parent container to check for the delete
// button being clicked within all of its children.
document.querySelector('#user-posts').addEventListener('click', deleteHandler);