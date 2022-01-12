// Client facing scripts here
//  ******* lookup escape function in tweeter clientInformation.js
//Entry point functions
$(".post-modal").hide();
$(".new-post-modal").hide();

//Helper function
const closeModal = () => {
  $(".modal-container").empty();
  $(".post-modal").hide();
}

const closeNewPostModal = () => {
  $(".new-post-modal").hide();
  $(".new-post-text").val("");

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


//Setter functions
const addPost = (newPost) => {
  return $.ajax({
    url: 'http://localhost:8080/posts/:id',
    method: 'POST',
    type: "json",
    data: newPost,
    success: function(data) {
      alert(data.message)
    }
  });
};


//HTML builder functions
const createPostElements = (post) => {
  const { id, img_src, total_likes } = post;
  return $(`
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
    `);
};

const createPostModalElements = (post) => {
  const { title, url_src, description, comment } = post;
  return $(`
  <div class="blue-background">
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
   </div>`);
};

const createNewPostModalElements = () => {
  return $(`
  <div class="blue-background">
  <h2>Create New Resource</h2>
  <form class="new-post-form">
    <input id="new-post-title" class="new-post-text" placeholder="Add title" /></a>
    <input id="new-post-url" class="new-post-text" placeholder="Add URL" />
    <input id="new-post-description" class="new-post-text" placeholder="Add description" />
    <input id="new-post-image-url" class="new-post-text" placeholder="Add image URL" />
    <div class="drop-down">
    <label for="topics">Topics</label>
    <select name="topics" id="topics">
      <option value="1">Coding</option>
      <option value="3">Food</option>
      <option value="2">Movies</option>
    </select>
    </div>
    <button type="submit" class="btn submit-post-button">Submit</button>
    </form>
  </div>`);
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
  const numberID = Number(id);
  getPosts()
    .then((data) => {
      const parsedData = data.posts;
      parsedData.forEach(post => {
        if (post.id === numberID) {
          $(".modal-container").append(createPostModalElements(post))
        }
      });
    })
};

const renderNewPostModal = () => {
  $(".new-post-modal-container").append(createNewPostModalElements())
};

//Document.ready
$(document).ready(() => {
  let posts;
  getPosts().done((data) => {
    posts = data.posts;
    renderPosts(posts);
    renderNewPostModal();

  })
    .then(() => {
      //Post modal interactions
      $(".card").on("click", function () {
        $(".post-modal").show();
        const id = $(this).attr('data-id');
        renderPostModal(id);
        $(".close-modal").click(closeModal);
      })

      //New post modal interactions
      $(".new-post-btn").on("click", function () {
        $(".new-post-modal").show();
        $(".close-modal").click(closeNewPostModal);
      })

      //New post submission
      $(".new-post-form").submit(function (event) {
        event.preventDefault();
        //Testing auto close modal on submission
        $(".new-post-modal").hide();
        $(".new-post-text").val("");
        const newTitle = $("#new-post-title").val();
        const newUrl = $("#new-post-url").val();
        const newDescription = $("#new-post-description").val();
        const newImageUrl = $("#new-post-image-url").val();
        const newTopic = $("#topics").val()
        const postData = {newTitle, newUrl, newDescription, newImageUrl, newTopic};
        console.log(postData)
        addPost(postData);

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
          $(".post-modal").show();
          const id = $(this).attr('data-id');
          renderPostModal(id)
          $(".close-modal").click(closeModal);
        })
      })

  });



});
