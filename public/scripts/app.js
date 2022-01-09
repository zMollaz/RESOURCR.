// Client facing scripts here
const getPosts = () => {
  return $.ajax({
    url: 'http://localhost:8080/posts',
    method: 'GET'
  })
}
const createPostElement = (post) => {
  console.log("post", post);
  let $post = `
  <div class="card">
    <img src="${post.img_src}">
  </div>



  `
  return $post;
}

const renderPosts = (posts) => {
  console.log("posts",posts);
  const $postContainer = $('.post-container');
  for (const post of posts) {
  const $post = createPostElement(post);
  $postContainer.prepend($post);
  }
}



$(document).ready(() => {
  let posts;
  getPosts().done((data) => {
  posts = data.posts;
  renderPosts(posts);
  })



});
