$ = (tag, mother = document) => mother.querySelector(tag)
$$ = (tag, mother = document) => mother.querySelectorAll(tag)
append = (array, mother) => array.map(item => mother.appendChild(item))
const site = 'https://jsonplaceholder.typicode.com/',
    postsSite = site + 'posts?userId=',
    usersSite = site + 'users',
    commentSite = site + 'posts/',
    loader = $('#loader'),
    loaderDots = $('#loaderDots', loader)
var loadInterval
startLoad = (bool = true) => {
    if (bool) {
        loader.classList.replace('d-none', 'd-block')
        loadInterval = setInterval(() => {
            if (loaderDots.textContent.length == 3) loaderDots.textContent = ''
            else loaderDots.textContent += '.'
        }, 500);
    } else {
        loader.classList.replace('d-block', 'd-none')
        clearInterval(loadInterval)
    }
}
startLoad()
fetch(usersSite)
    .then(response => {
        response.json().then(data => {
            append(data.map(user => {
                let userTemplate = $('#user').content.cloneNode(true),
                    name = $('.user-name', userTemplate),
                    email = $('.user-mail', userTemplate)
                company = $('.user-company', userTemplate)
                $('.card', userTemplate).id = user.id
                name.innerHTML = user.username + ' with email:'
                name.id = user.id
                name.style.fontWeight = '700'
                name.onclick = getPost
                email.innerHTML = user.email
                    // console.log(user);
                email.href = 'https://' + user.email.toLocaleLowerCase()
                company.innerHTML = 'from ' + user.company.name + ' <br/> company '
                return userTemplate
            }), $('#usersDiv'))
            $('#usersDiv').classList.remove('d-none')
            startLoad(false)
        })
    })
getPost = event => {
    startLoad()
    fetch(postsSite + event.target.id)
        .then(response => {
            response.json()
                .then(posts => {
                    let postDiv = $('#postsDiv'),
                        h = postDiv.children[0].cloneNode(true)
                    postDiv.innerHTML = ''
                    postDiv.appendChild(h)
                    postDiv.classList.remove('d-none')
                    append(posts.map(post => {
                        let postTemp = $("#post").content.cloneNode(true),
                            body = $('.post-body', postTemp),
                            title = $('.post-title', postTemp)
                        body.textContent = post.body
                        title.textContent = post.title
                        $('.card', postTemp).id = post.id
                        $('.card-body', postTemp).id = post.id
                        $('.card', postTemp).onclick = getComments
                            // console.log(post, $('.card', postTemp));
                        return postTemp
                    }), postDiv)
                    startLoad(false)
                })
        })
}
getComments = event => {
    startLoad()
    fetch(commentSite + event.target.parentNode.id + '/comments')
        .then(response => {
            response.json()
                .then(comments => {
                    let commentsDiv = $('#commentsDiv'),
                        h = commentsDiv.children[0].cloneNode(true)
                    commentsDiv.innerHTML = ''
                    commentsDiv.appendChild(h)
                    commentsDiv.classList.remove('d-none')
                    append(comments.map(comment => {
                        let commentTemp = $("#comment").content.cloneNode(true),
                            body = $('.comment-body', commentTemp),
                            title = $('.comment-title', commentTemp),
                            email = $('.comment-mail', commentTemp)
                        body.textContent = comment.body
                        title.textContent = comment.name
                        email.innerHTML = comment.email
                        email.href = 'https://' + comment.email.toLocaleLowerCase()
                        return commentTemp
                    }), commentsDiv)
                    startLoad(false)
                })
        })
}