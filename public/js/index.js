$(document).ready(function() {
    $(".productBox").click(function() {
      var productName = $(this).find('img').attr('placeholder');
      var productType = $(this).find('input').val();

      $.get('/getProductInfo', {name: productName, type: productType}, function(result){
        if (result) {
          if (productType == 'Cake') {
            $('#displayProductName').text(result.name)
            $('#displayProductPrice').text(result.vanilla6x5Price)
            $('#displayProductFlavor').change(function() {
              updateCakePrice(result)
            })
            $('#displayProductSize').change(function() {
              updateCakePrice(result)
            })
          } else if (productType == 'Cupcake'){
            $('#displayProductPrice').text(result.vanillaPrice)
            $('#displayProductFlavor').change(function() {
              updateCupcakePrice(result)
            })
          } else {
            $('#displayProductPrice').text(result.price)
          }
        }
      })

      document.querySelector('.modalBackground').style.display = 'flex';
    });

    function updateCakePrice(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      var currentSize = $('#displayProductSize').val()
      if (currentFlavor == 'Vanilla' && currentSize == '6x5') {
        $('#displayProductPrice').text(result.vanilla6x5Price)
      } else if (currentFlavor == 'Chocolate' && currentSize == '6x5'){
        $('#displayProductPrice').text(result.chocolate6x5Price)
      } else if (currentFlavor == 'Vanilla' && currentSize == '8x5') {
        $('#displayProductPrice').text(result.vanilla8x5Price)
      } else {
        $('#displayProductPrice').text(result.chocolate8x5Price)
      }
    }

    function updateCupcakePrice(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      if (currentFlavor == 'Vanilla') {
        $('#displayProductPrice').text(result.vanillaPrice)
      } else if (currentFlavor == 'Chocolate'){
        $('#displayProductPrice').text(result.chocolatePrice)
      } else {
        $('#displayProductPrice').text(result.redVelvetPrice)
      }
    }

    $(".close").click(function() {
      document.querySelector('.modalBackground').style.display = 'none';
    });
    
    $(".incdec").click(function() {
      var quantity = parseInt($(".quantity").val());

      if (isNaN(quantity))
          quantity = 0;

      if ($(this).attr("id") == 'increment') {
         quantity++;
      } else {
         quantity--;
    
         if (quantity <= 0) 
           quantity = 1;
      }
      
      $(".quantity").val(quantity);
    })  

    $(".quantity").keydown(function(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
        || (e.keyCode > 47 && e.keyCode < 58) 
        || e.keyCode == 8  || e.keyCode == 46 
        || e.keyCode > 36 || e.keyCode < 41)) {
          return false;
      }
    })

  });