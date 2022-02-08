// gets user's input and posts a comment to a blog post
async function commentHandler(event){
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // get id of the post from the url
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if(comment_text){
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // if comment added to database successfully, reload the page.
        if(response.ok){
            document.location.reload()
        }
        else{
            alert(response.statusText);
        }
    }
}

// add comment form submit listener
document.querySelector('#comment-form').addEventListener('submit', commentHandler)