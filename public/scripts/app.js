// Client facing scripts here
//  ******* lookup escape function in tweeter clientInformation.js

//Entry point functions
$(".post-modal").hide();
$(".new-post-modal").hide();
$(".user-modal").hide();

//Helper function
const closeModal = () => {
  $(".modal-container").empty();
  $(".post-modal").hide();
};

const closeNewPostModal = () => {
  $(".new-post-modal").hide();
  $(".new-post-text").val("");
};

const closeUserModal = () => {
  $(".user-modal-container").empty();
  $(".user-modal").hide();
  $(".user-text").val("");
};

const printStars = (post) => {
  const hollowStar = `<i class="far fa-star"></i>`;
  const filledStar = `<i class="fas fa-star"></i>`;
  let stars;
  const rating = Math.round(post.average_rating * 100) / 100;
  if (rating) {
    stars = filledStar.repeat(rating);
  } else {
    stars = hollowStar.repeat(5);
  }
  return stars;
};

const main = function () {
  $(".btn").click(function () {
    const post = $(".status-box").val();
    $("<li>").text(post).prependTo(".posts");
    $(".status-box").val("");
    $(".counter").text("250");
    $(".btn").addClass("disabled");
  });
};

//Sends user id to the backend
const switchUser = () => {
  let userId = $("#user-selection").val();
  return $.ajax({
    url: `http://localhost:8080/users/${userId}`,
    method: "POST",
    data: userId
  });
};

//Getter functions
const getPosts = () => {
  return $.ajax({
    url: "http://localhost:8080/posts",
    method: "GET",
    type: "json",
  });
};

const getCreatedPosts = () => {
  let userId = $("#user-selection").val();
  return $.ajax({
    url: `http://localhost:8080/users/${userId}/posts`,
    method: "GET",
    type: "json",
    data: userId,
  });
};

const getMyLikes = () => {
  let userId = $("#user-selection").val();
  return $.ajax({
    url: `http://localhost:8080/users/${userId}/likes`,
    method: "GET",
    type: "json",
    data: userId
  });
};

const getPost = (id) => {
  return $.ajax({
    url: `http://localhost:8080/posts/${id}`,
    method: "GET",
    type: "json",
  });
};

const getPostsByTopic = (topic) => {
  return $.ajax({
    url: "http://localhost:8080/posts/search",
    method: "POST",
    type: "json",
    data: {
      topic,
    },
  });
};

const getUser = () => {
  return $.ajax({
    url: `http://localhost:8080/users/`,
    method: "GET",
    type: "json",
  });
};

//Setter functions
const addPost = (newPost) => {
  return $.ajax({
    url: "http://localhost:8080/posts/",
    method: "POST",
    type: "json",
    data: newPost
  });
};

const updateUser = (updatedUser) => {
  return $.ajax({
    url: "http://localhost:8080/users",
    method: "POST",
    type: "json",
    data: updatedUser
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

const createPostModalElements = (post, id) => {
  const { title, url_src, description } = post;
  return $(`
  <div class="modal-title" data-id= ${id}>${title}</div>
  <div class="modal-description">${description}</div>
  <a href="${url_src}"target="_blank" rel="noreferrer noopener"><div class="modal-url">${url_src}</div></a>
  <br>
<h3 class="heading">Add A Comment Below</h3>
  <div class="container">
      <ul class="posts">
      </ul>
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
      <br>
    <button type="submit" class="btn submit-post-button">Submit</button>
    </form>
  </div>`);
};

const createUserModalElements = (user) => {
  const { name, email, password } = user;
  return $(`
  <div class="blue-background">
  <h2>Edit profile</h2>
  <form class="user-form">
    <label for="name">Change name</label>
    <input id="name" name="name" class="user-text" placeholder="${name}" />
    <label for="email">Change email</label>
    <input id="email" name="email" class="user-text" placeholder="${email}" />
    <label for="password">Change password</label>
    <input id="password" name="password" class="user-text" placeholder="${password}" />
    <br>
    <button type="submit" class="btn submit-user-button">Submit</button>
    </form>
  </div>`);
};

//Render functions
const renderPosts = (posts) => {
  const $postContainer = $(".post-container");
  for (const post of posts) {
    const $post = createPostElements(post);
    $postContainer.prepend($post);
  }
};

const renderPostModal = (id) => {
  getPost(id).then((data) => {
    const post = data.post;
    $(".modal-container").append(createPostModalElements(post, id));
  });
};

const renderUserModal = (user) => {
  $(".user-modal-container").append(createUserModalElements(user));
};

const renderNewPostModal = () => {
  $(".new-post-modal-container").append(createNewPostModalElements());
};

//Document.ready
$(document).ready(() => {
  let posts;
  let userPosts;
  getPosts()
    .done((data) => {
      posts = data.posts;
      renderPosts(posts);
      renderNewPostModal();
    })
    .then(() => {
      //Home page button interaction
      $("#home-page").click(() => {
        window.location.replace("http://localhost:8080/");
      });

      //Post modal interactions
      $(".card").on("click", function () {
        $(".post-modal").show();
        const id = $(this).attr("data-id");
        renderPostModal(id);
        $(".close-modal").click(closeModal);
      });

      //New post modal interactions
      $(".new-post-btn").on("click", function () {
        $(".new-post-modal").show();
        $(".close-modal").click(closeNewPostModal);
      });

      //New post submission
      $(".new-post-form").submit(function (event) {
        event.preventDefault();
        $(".new-post-modal").hide();
        const newTitle = $("#new-post-title").val();
        const newUrl = $("#new-post-url").val();
        const newDescription = $("#new-post-description").val();
        const newImageUrl = $("#new-post-image-url").val();
        const newTopic = $("#topics").val();
        const postData = {
          newTitle,
          newUrl,
          newDescription,
          newImageUrl,
          newTopic
        };
        $(".new-post-text").val("");
        addPost(postData);
      });
    });

  //Get user posts
  $("#user-posts-button").click(() => {
    $(".post-container").empty();
    getCreatedPosts().done((data) => {
      userPosts = data.posts;
      renderPosts(userPosts);
      $(".card").on("click", function () {
        $(".post-modal").show();
        const id = $(this).attr("data-id");
        renderPostModal(id);
        $(".close-modal").click(closeModal);
      });
    });
  });

  //Get user liked posts
  $("#user-likes-button").click(() => {
    $(".post-container").empty();
    getMyLikes().done((data) => {
      userLikes = data.posts;
      renderPosts(userLikes);
      $(".card").on("click", function () {
        $(".post-modal").show();
        const id = $(this).attr("data-id");
        renderPostModal(id);
        $(".close-modal").click(closeModal);
      });
    });
  });

  //User modal interactions
  $(".edit-profile").on("click", function () {
    //Get user
    getUser()
      .done((data) => {
        user = data.user;
        renderUserModal(user);
      })
      .then(() => {
        $(".user-modal").show();
        $(".close-modal").click(closeUserModal);
        //User update submission
        $(".user-form").submit(function (event) {
          event.preventDefault();
          const newName = $("#name").val();
          const newEmail = $("#email").val();
          const newPassword = $("#password").val();
          const newUserData = {
            newName,
            newEmail,
            newPassword
          };
          updateUser(newUserData);
          closeUserModal();
        });
      });
  });

  //Switch user
  $("#user-selection").on("change", switchUser);

  //Comment box
  $(".status-box").keyup(function () {
    const postLength = $(this).val().length;
    const charactersLeft = 250 - postLength;
    $(".counter").text(charactersLeft);
    if (charactersLeft < 0) {
      $(".btn").addClass("disabled");
    } else if (charactersLeft === 250) {
      $(".btn").addClass("disabled");
    } else {
      $(".btn").removeClass("disabled");
    }
  });

  //Adds comments
  const addComments = (id) => {
    const comment = $(".status-box").val();
  };

  //Posts comments
  $("#comments-form").submit(function (e) {
    e.preventDefault();
    const id = $(".modal-title").attr("data-id");
    const comment = $(this).find("textarea").val();
    $.ajax({
      url: `http://localhost:8080/posts/comment/${id}`,
      method: "POST",
      type: "json",
      data: {
        id: id,
        post: comment
      }
    });

    $("<li>").text(comment).prependTo(".posts");
    $(".status-box").val("");
    $(".counter").text("250");
    $(".btn").addClass("disabled");
  });

  //Heart function for likes
  $(function () {
    $(".heart-likes").on("click", function () {
      const id = $(".modal-title").attr("data-id");
      $(this).toggleClass("is-active");
      $.ajax({
        url: `http://localhost:8080/posts/${id}/like`,
        method: "POST",
        type: "json"
      });
    });
  });

  //Star function for ratings
  $(function () {
    $("#rating-container > .rating-star").mouseenter(function () {
      $(this).prevAll().andSelf().addClass("rating-hover");
      $(this).nextAll().removeClass("rating-hover").addClass("no-rating");
      $(".meaning").fadeIn("fast");
    });
    $("#rating-container > .rating-star").mouseleave(function () {
      $(this).nextAll().removeClass("no-rating");
    });
    $("#rating-container").mouseleave(function () {
      $(".rating-star").removeClass("rating-hover");
      $(".meaning").fadeOut("fast");
    });
    $("#rating-container > .rating-star").click(function () {
      $(this).prevAll().andSelf().addClass("rating-chosen");
      $(this).nextAll().removeClass("rating-chosen");
    });
    $("#1-star")
      .hover(function () {
        $(".meaning").text("1/5 Meh");
      })
      .click(function () {
        sendRating(1);
      });
    $("#2-star")
      .hover(function () {
        $(".meaning").text("2/5 Not good, not bad.");
      })
      .click(function () {
        sendRating(2);
      });
    $("#3-star")
      .hover(function () {
        $(".meaning").text("3/5 It's okay I guess");
      })
      .click(function () {
        sendRating(3);
      });
    $("#4-star")
      .hover(function () {
        $(".meaning").text("4/5 Nice!");
      })
      .click(function () {
        sendRating(4);
      });
    $("#5-star")
      .hover(function () {
        $(".meaning").text("5/5 Best thing ever");
      })
      .click(function () {
        sendRating(5);
      });
  });

  const sendRating = (rating) => {
    const id = $(".modal-title").attr("data-id");
    $.ajax({
      url: `http://localhost:8080/posts/${id}/rating`,
      method: "POST",
      type: "json",
      data: {
        rating: rating
      }
    });
  };

  //Search function
  $("#form").submit(function (event) {
    const $topic = $("#search").val();
    event.preventDefault();
    getPostsByTopic($topic)
      .done((data) => {
        posts = data.posts;
        if (posts.length > 0) {
          const $postContainer = $(".post-container");
          $postContainer.empty();
        }
        renderPosts(posts);
      })
      .then(() => {
        $(".card").on("click", function () {
          $(".post-modal").show();
          const id = $(this).attr("data-id");
          renderPostModal(id);
          $(".close-modal").click(closeModal);
        });
      });
  });

  // Comment box
  $(".btn").addClass("disabled");
});
