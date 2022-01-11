// Client facing scripts here

//Helper function
$(".modal").hide();

const closeModal = () => {
  $(".modal-container").empty();
  $(".modal").hide();
}

const printStars = (post) => {
  const hollowStar = `<i class="far fa-star"></i>`;
  const filledStar = `<i class="fas fa-star"></i>`;
  let stars;
  const rating = (Math.round(post.average_rating * 100) / 100);
  if (rating) {
    stars = filledStar.repeat(rating);
  } else {
    stars = hollowStar.repeat(5);
  }
  return stars;
};


//Getter functions
const getPosts = () => {
  return $.ajax({
    url: 'http://localhost:8080/posts',
    method: 'GET',
    type: "json"

  });
};

const getPostsByTopic = (topic) => {
  return $.ajax({
    url: 'http://localhost:8080/posts/search',
    method: 'POST',
    type: "json",
    data: { topic }
  });
};


//HTML builder functions
const createPostElements = (post) => {
  const { id, img_src, total_likes } = post;
  let $post = `
  <div class="card card_medium" data-id= ${id}>
  <div class="imgContainer">
  <img src=${img_src} />
  <div class="bottomComponents">
  <div class="heartHover">
    <span>
    <i class="fas fa-heart"></i>
    <span class= "likesCounter">${total_likes}</span>
    </div>
    </span>
  <span class="post_rating">${printStars(post)}</span>
    </div>
    </div>
    </div>
    `;
  return $post;
};

const createPostModalElements = (post) => {
  const { title, url_src, description, comment } = post;
  return $(`<div class="blue-background">
  <div class="modal-title">${title}</div>
  <div class="modal-url">${url_src}</div>
  <div class="modal-description">${description}</div>
  <div class="modal-comments">${comment}</div>
  <div class="comment-textbox">
  <form>
  <textarea class="text" placeholder="Add comment"></textarea>
  </form>
  <div class="modal-likes-rating">
    <i class="fas fa-heart"></i>
    <div class="ratings">
      <p>Rate this post</p>
      <i class="fas fa-star"></i>
  </div>
  </div>
   </div>`)
}


//Render functions
const renderPosts = (posts) => {
  const $postContainer = $('.post-container');
  for (const post of posts) {
    const $post = createPostElements(post);
    $postContainer.prepend($post);
  }
};

const renderPostModal = (id) => {
  getPosts()
    .then((data) => {
      const parsedData = data.posts;
      parsedData.forEach(post => {
        if (post.id == id) {
          $(".modal-container").append(createPostModalElements(post))
        }
      });
    })
};


//Document.ready
$(document).ready(() => {
  let posts;
  getPosts().done((data) => {
    posts = data.posts;
    renderPosts(posts);
  })
    .then(() => {
      $(".card").on("click", function () {
        $(".modal").show();
        const id = $(this).attr('data-id');
        renderPostModal(id)

        $(".close-modal").click(closeModal);
      })
    })

  //Search function
  $("#form").submit(function (event) {
    const $topic = $("#search").val()
    event.preventDefault();

    getPostsByTopic($topic).done((data) => {
      posts = data.posts;
      if (posts.length > 0) {
        const $postContainer = $('.post-container');
        $postContainer.empty();
      }
      renderPosts(posts);
    })
      .then(() => {
        $(".card").on("click", function () {
          $(".modal").show();
          const id = $(this).attr('data-id');
          renderPostModal(id)
          $(".close-modal").click(closeModal);
        })
      })

  });



});
