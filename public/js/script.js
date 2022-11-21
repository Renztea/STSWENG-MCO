
// Checks if there are error messages to automatically open the modal.
$( document ).ready(function() {
    var errors = '<%= error_msg %>';
    if(errors.length > 0) {
        $('#cakeModal').css('display', 'block')
    }	
    $(".inputNum").css('background-color', 'gray')
});
// Get the modal
var modal = document.getElementById("cakeModal");
// Get the button that opens the modal
var btn = document.getElementById("add");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Checks if the inputted product name is already available in the database
$('#productName').blur(function () {
    var productName = $(this).val()
    var productType = window.location.pathname.split("/").pop()
    $.get('/getProductInfo', {name: productName, type: productType}, function(result) {
        if (result) {
            $('#productName').css('background-color', 'red')
            $('#errorName').text('Cake is already available!')
            $('#errorName').css('color', 'red')
            $('#addl').prop('disabled', true)
        } else {
            $('#productName').css('background-color', 'white')
            $('#errorName').text('')
            $('#addl').prop('disabled', false)
        }
    })
})

// Remove a product from the view and call the delete function from the controller
$('.Remove').click(function() {
    if (confirm('Are you sure you want to delete the product?') == true) {
        var border = $(this).parents('.border')
        var productName = border.children('#displayProductName').text()
        var productType = window.location.pathname.split("/").pop()
        var productImage = border.find('img').attr('src')
        border.empty()
        border.remove()
        $.get('/deleteProduct', {name: productName, image: productImage, type: productType}, function(result) {
            alert(result)
        })
    }
})

// Disables textboxes that are not needed for a certain type of product
$('#productNumberCake').change(function() {
    if ($(this).is(":checked") == true) {
        $(".input").val(0);
        $(".input").attr('placeholder', 'Not Applicable');
        $(".input").attr('readonly', true);
        $(".input").css('background-color', 'gray')
        $(".inputNum").css('background-color', 'white')
        $(".inputNum").attr('placeholder', 'Enter Price');
        $(".inputNum").attr('readonly', false);
    } else {
        $(".input").attr('placeholder', 'Enter Price');
        $(".input").attr('readonly', false);
        $(".input").css('background-color', 'white')
        $(".inputNum").val(0);
        $(".inputNum").css('background-color', 'gray')
        $(".inputNum").attr('placeholder', 'Not Applicable');
        $(".inputNum").attr('readonly', true);
    }
})
