// Client facing scripts here
const getPosts = () => {
  return $.ajax({
    url: 'http://localhost:8080/posts',
    method: 'GET'
  })
}
$(document).ready(() => {
  let posts;
  getPosts().done((data) => {
    posts = data;
  })



});
