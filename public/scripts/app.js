// Client facing scripts here
$(".modal").hide()
// const something = $('.class name').attr('data-id', id);
const printStars = (post) => {
  const hollowStar = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
  </svg>`;
  const filledStar = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>`;
  let stars;
  const rating = (Math.round(post.average_rating * 100) / 100);
  if (rating) {
    stars = filledStar.repeat(rating);
  } else {
    stars = hollowStar.repeat(5);
  }
  return stars;
};

const getPosts = () => {
  return $.ajax({
    url: 'http://localhost:8080/posts',
    method: 'GET',
    type: "json"

  });
};

const createPostElement = (post) => {
  const { id, img_src, total_likes } = post;
  // console.log("post", post);
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

const renderModal = (post) => {
  const {title, url_src, description, comment} = post;
  return $(`<div class="blue-background">
  <div class="modal-title">${title}</div>
  <div class="modal-url">${url_src}</div>
  <div class="modal-description">${description}</div>
  <div class="modal-comments">${comment}</div>
  <div class="modal-likes-rating">
    <i class="fas fa-heart"></i>
    <div class="ratings">
      <p>Rate this post</p>
      <i class="fas fa-star"></i>
  </div>
  </div>
   </div>`)
}



const renderPosts = (posts) => {
  // console.log("posts", posts);
  const $postContainer = $('.post-container');
  for (const post of posts) {
    const $post = createPostElement(post);
    $postContainer.prepend($post);
  }
};

const getSingleModalData = (id) => {
  getPosts()
    .then((data) => {
      console.log("item", data.posts[0])
      const parsedData = data.posts;
      parsedData.forEach(post => {
        if (post.id == id) {
          $(".modal-container").append(renderModal(post))
        }

      });
    })
};

const closeModal = () => {
  $(".modal-container").empty();
  $(".modal").hide();
}

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
        getSingleModalData(id)

        $(".close-modal").click(closeModal);
      })
    })


});
