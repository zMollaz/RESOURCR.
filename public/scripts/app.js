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
  const { id, img_src, total_likes} = post;
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
  <div class="modal-description">${description}</div>
  <div class="modal-url">${url_src}</div>
  <br><br>
<h3 class="heading">Add A Comment Below</h3>
  <div class="container">
      <ul class="posts">
      </ul>
  </div>
   </div>`)
}

// <div class="modal-comments">${comment}</div> in case we need the comment on modal

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

const main = function () {
  $('.btn').click(function () {
    const post = $('.status-box').val();
    $('<li>').text(post).prependTo('.posts');
    $('.status-box').val('');
    $('.counter').text('250');
    $('.btn').addClass('disabled');
  });
}

//Document.ready
$(document).ready(() => {
  let posts;
  getPosts().done((data) => {
    console.log(data.posts)
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

    //comment box
  $('.status-box').keyup(function () {
    const postLength = $(this).val().length;
    const charactersLeft = 250 - postLength;
    $('.counter').text(charactersLeft);
    if (charactersLeft < 0) {
      $('.btn').addClass('disabled');
    } else if (charactersLeft === 250) {
      $('.btn').addClass('disabled');
    } else {
      $('.btn').removeClass('disabled');
    }
  });

  //adding comments
  const addComments = (id) => {
    const comment = $('.status-box').val();
  }

  //post comments
  $("#comments-form").submit(function (e) {
    e.preventDefault();
    console.log("abc")
    const id = $(".card").attr('data-id');
    const comment = $(this).find("textarea").val();
    $.ajax({
      url: 'http://localhost:8080/posts/comment',
      method: 'POST',
      type: "json",
      data: { id: id, post: comment },
      success: function (data) {
        console.log("data is", data)

      }
    });

    console.log("this is a comment", comment)
    $('<li>').text(comment).prependTo('.posts');
    $('.status-box').val('');
    $('.counter').text('250');
    $('.btn').addClass('disabled');
  })

  //heart function for likes
  $(function() {
    $(".heart-likes").on("click", function() {
      $(this).toggleClass("is-active");
    });
  });

//star function for ratings
$(function() {
  $('#rating-container > .rating-star').mouseenter(function() {
    $(this).prevAll().andSelf().addClass("rating-hover")
    $(this).nextAll().removeClass("rating-hover").addClass("no-rating");
    $('.meaning').fadeIn('fast');
  });
  $('#rating-container > .rating-star').mouseleave(function() {
    $(this).nextAll().removeClass("no-rating");
  });
  $('#rating-container').mouseleave(function() {
    $('.rating-star').removeClass("rating-hover");
    $('.meaning').fadeOut('fast');
  });

  $('#rating-container > .rating-star').click(function() {
    $(this).prevAll().andSelf().addClass("rating-chosen");
    $(this).nextAll().removeClass("rating-chosen");
  });

  $("#1-star").hover(function() {
    $('.meaning').text('1/5 Meh');
  });
  $("#2-star").hover(function() {
    $('.meaning').text('2/5 Not good, not bad.');
  });
  $("#3-star").hover(function() {
    $('.meaning').text('3/5 It\'s okay I guess');
  });
  $("#4-star").hover(function() {
    $('.meaning').text('4/5 Nice!');
  });
  $("#5-star").hover(function() {
    $('.meaning').text('5/5 Best thing ever');
  });
});

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

  // comment box
  $('.btn').addClass('disabled');
});


