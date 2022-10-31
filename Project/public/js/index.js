$(document).ready(function () {

    $('#usernameinput').keyup(function () {
        var username = $('#usernameinput').val();
        $.get('/getCheckUsername', {username: username}, function (result) {
            if(result.username == username) {
                $('#usernameinput').css('background-color', 'red');
                $('#error').text('Username is already taken');
                $('#error').css('color', 'red');
                $('#registersubmit').prop('disabled', true);
            } else {
                $('#usernameinput').css('background-color', 'white');
                $('#error').text('');
                $('#registersubmit').prop('disabled', false);
            }
        });
    });

    $('#emailinput').keyup(function () {
        var email = $('#emailinput').val();
        $.get('/getCheckEmail', {email: email}, function (result) {
            if(result.email == email) {
                $('#emailinput').css('background-color', 'red');
                $('#error2').text('Email is already taken!!!');
                $('#error2').css('color', 'red');
                $('#registersubmit').prop('disabled', true);
            } else {
                $('#emailinput').css('background-color', 'white');
                $('#error2').text('');
                $('#registersubmit').prop('disabled', false);
            }
        });
    });

    $('#profname').keyup(function () {
        var username = $('#profname').val();
        $.get('/getCheckUsername', {username: username}, function (result) {
            if(result.username == username) {
                $('#profname').css('background-color', 'red');
                $('#error').text('Username is already taken');
                $('#error').css('color', 'red');
                $('#savebutton').prop('disabled', true);
            } else {
                $('#profname').css('background-color', 'white');
                $('#error').text('');
                $('#savebutton').prop('disabled', false);
            }
        });
    });

    $('#emailinput').keyup(function () {
        var email = $('#emailinput').val();
        $.get('/getCheckEmail', {email: email}, function (result) {
            if(result.email == email) {
                $('#emailinput').css('background-color', 'red');
                $('#error2').text('Email is already taken!!!');
                $('#error2').css('color', 'red');
                $('#registersubmit').prop('disabled', true);
            } else {
                $('#emailinput').css('background-color', 'white');
                $('#error2').text('');
                $('#registersubmit').prop('disabled', false);
            }
        });
    });

    $('#profpassword2').keyup(function () {
        var password = $('#profpassword2').val();
        $.get('/getCheckPassword', {password: password}, function (result) {
            if(result == password) {
                $('#profpassword2').css('background-color', 'lightgreen');
                $('#error2').text('');
                $('#savebutton').prop('disabled', false);
            } else {
                $('#profpassword2').css('background-color', 'red');
                $('#error2').text('That is not your current password');
                $('#savebutton').prop('disabled', true);
            }
        });
    });
    

    $('#blogsubmit').click(function () {
        var title = document.getElementById('title').value;
        var image = document.getElementById('image').value;
        var description = document.getElementById('description').value;
        var content = document.getElementById('content').value;
        var genre = document.getElementById('genre').value;

        if (title === '' || image === '' || description === '' || content === '') {
            console.log('Not all needed info are given');
            $("#error").text("Fill up all fields.");
        } else {
            $.get('/addpost', {title:title, image:image, description:description, content:content, genre: genre}, function(result){
                if (result){
                    window.location.href='/';
                }
            })
        }
    });
    
    $('#comment').click(function () {
        event.preventDefault();
        var comment = document.getElementById('commentbox').value;
        var postID = document.getElementById('postID').value;
        if (comment === '') {
            $("#error").text("Fill up all fields.");
        } else {
            $.get('/addcomment', {comment: comment, postID, postID}, function(result){
                if (result){
                    $("#commentsection").append(result);
                } 
            })
            $("#comment").val('');
        }
    });

    $( "#submenu" ).change(function() {
        $(".box").hide();
        if (this.value == "general"){
            $(".box").show();
        } else {
          $('.' + this.value).show();
        }
    });
    
    $("#updateblog").click(function() {        
        $('#editdeleteform').attr('action', '/edit-blog');
    });

    $("#deleteblog").click(function() {
        $('#editdeleteform').attr('action', '/delete-blog');
    });

    $("#thumbsup").click(function() {
        var numberoflikes = $('span').html()
        var postID = document.getElementById('postID').value;

        $.get('/thumbsup', {postID: postID, numberoflikes: numberoflikes}, function(result){
            if (result == 'Goods'){
                numberoflikes = parseInt(numberoflikes) + 1
                $('span').html(numberoflikes)
            } 
        })
    });
})