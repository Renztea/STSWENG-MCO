$(document).ready(function() {
    $("#basketBtn").click(function() {
      $.get('/Basket', {}, function(result) {

      })
    })

    $(".productBox").click(function() {
      var productName = $(this).find('img').attr('placeholder');
      var productType = $(this).find('input').val();

      document.querySelector('.mainBackground').style.overflow = 'hidden';

      $.get('/getProductInfo', {name: productName, type: productType}, function(result) {
        if (result) {
          $('#displayProductImage').attr('src', result.image);
          $('#displayProductName').text(result.name)
          $("#orderQuantity").val(1)
          if (productType == 'Cake') {
            $('#displayProductFlavor').find('option').remove()
            $('#displayProductSize').find('option').remove()
            $('#displayProductFrosting').find('option').remove()
            var hasVanillaFlavor = false;
            var hasSize6x5 = false;
            var hasSize8x5 = false;

            if (result.vanilla6x5Price > 0 || result.vanilla8x5Price > 0) {
              $('#displayProductFlavor').append(new Option("Vanilla", "vanilla"))
              hasVanillaFlavor = true;
              if (result.vanilla6x5Price > 0) {                
                $('#displayProductSize').append(new Option("6\" x 5\"", "6x5"))
                hasSize6x5 = true
              }
              if (result.vanilla8x5Price > 0) {
                $('#displayProductSize').append(new Option("8\" x 5\"", "8x5"))
                hasSize8x5 = true
              }
            }

            if (result.chocolate6x5Price > 0 || result.chocolate8x5Price > 0) {
              $('#displayProductFlavor').append(new Option("Chocolate", "chocolate"))
              if (!hasSize6x5 && !hasVanillaFlavor && result.chocolate6x5Price > 0) {
                $('#displayProductSize').append(new Option("6\" x 5\"", "6x5"))
              }              

              if (!hasSize8x5 && !hasVanillaFlavor && result.chocolate8x5Price > 0) {
                $('#displayProductSize').append(new Option("8\" x 5\"", "8x5"))
              }
            } 
            
            var sizeSelected = $('#displayProductSize').find(":selected").val();            
            if (hasVanillaFlavor) {
              if (sizeSelected == "6x5") {
                $('#displayProductPrice').text(result.vanilla6x5Price)
              }
              if (sizeSelected == "8x5") {
                $('#displayProductPrice').text(result.vanilla8x5Price) 
              }             
            } else {              
              if (sizeSelected == "6x5") {
                $('#displayProductPrice').text(result.chocolate6x5Price)
              }
              if (sizeSelected == "8x5") {
                $('#displayProductPrice').text(result.chocolate8x5Price)
              }
            }
            
            $('#displayProductFlavor').change(function() {
              updateAvailableSize(result)
              updateCakePrice(result)
            })

            $('#displayProductSize').change(function() {
              updateCakePrice(result)
            })
          } else if (productType == 'Cupcake') {
            $('#displayProductFlavor').find('option').remove()
            var defaultPrice = true;

            if (result.vanillaPrice > 0) {
              $('#displayProductFlavor').append(new Option("Vanilla", "vanilla"))
              $('#displayProductPrice').text(result.vanillaPrice)
              defaultPrice = false
            }
            if (result.chocolatePrice > 0) {
              $('#displayProductFlavor').append(new Option("Chocolate", "chocolate"))
              if(defaultPrice) {
                $('#displayProductPrice').text(result.chocolatePrice)
                defaultPrice = false
              }
            }
            if (result.redvelvetPrice > 0) {
              $('#displayProductFlavor').append(new Option("Red Velvet", "redVelvet"))
              if(defaultPrice) {
                $('#displayProductPrice').text(result.redvelvetPrice)
                defaultPrice = false
              }
            }

            if (!defaultPrice) {
              $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
              $('#displayProductFrosting').append(new Option("Icing", "icing"))
            }

            $('#displayProductFlavor').change(function() {
              $('#displayProductFrosting').val("fondant");
              updateCupcakePrice(result)
            })
          } else {
            $('#displayProductPrice').text(result.price)
          }
          document.querySelector('.modalBackground').style.display = 'flex';
        }
      }).fail(function() {
        
      })
    });

    function updateAvailableSize(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      $('#displayProductSize').find('option').remove()
      if (currentFlavor == "Vanilla") {
        if (result.vanilla6x5Price > 0) {
          $('#displayProductSize').append(new Option("6\" x 5\"", "6x5"))                  
        }
        if (result.vanilla8x5Price > 0) {
          $('#displayProductSize').append(new Option("8\" x 5\"", "8x5"))
        }
      } else {
        if (result.chocolate6x5Price > 0) {
          $('#displayProductSize').append(new Option("6\" x 5\"", "6x5"))
        }
        if (result.chocolate8x5Price > 0) {
          $('#displayProductSize').append(new Option("8\" x 5\"", "8x5"))
        }
      }
    }
  
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
            $('#displayProductPrice').text(result.redvelvetPrice)
        }
    }
  
    $(".close").click(function() {
        document.querySelector('.mainBackground').style.overflow = 'auto';
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

    $(".addBtn").click(function() {
      $.post('/postBasketItem', 
            {name: $('#displayProductName').text(), 
            price: $('#displayProductPrice').text(), 
            flavor: $('#displayProductFlavor').find(":selected").val() || "", 
            size: $('#displayProductSize').find(":selected").val() || "", 
            frosting: $('#displayProductFrosting').find(":selected").val() || "", 
            quantity: $("#orderQuantity").val(),
            type: $(this).val()
          }, function(result) {
            alert(result);
      }).fail(function() {

      })    
    })
  
});