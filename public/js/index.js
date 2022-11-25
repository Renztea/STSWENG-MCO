$(document).ready(function() {
  /*
    $("#basketBtn").click(function() {
      $.get('/Basket', {}, function(result) {
        return result
      })
    })
    */

    $(".productBox").click(function() {
      var productName = $(this).find('img').attr('placeholder');
      var productType = $(this).find('input').val();

      document.querySelector('.mainBackground').style.overflow = 'hidden';

      $.get('/getProductInfo', {name: productName, type: productType}, function(result) {
        if (result) {
          $('#displayProductImage').attr('src', result.image);
          $('#displayProductName').text(result.name)
          $("#orderQuantity").val(1)
          $('#displayProductFlavor').find('option').remove()
          $('#displayProductSize').find('option').remove()
          $('#displayProductFrosting').find('option').remove()
          if (productType == 'Cake') {
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
              updateAvailableCakeSize(result)
              updateCakePrice(result)
            })

            $('#displayProductSize').change(function() {
              updateCakePrice(result)
            })
          } else if (productType == 'Cupcake') {
            $('#displayProductFlavor').find('option').remove()
            var hasVanillaFlavor = false;
            var hasChocolateFlavor = false;
            var hasFondant = false;
            var hasIcing = false;

            if (result.vanillaFondantPrice > 0 || result.vanillaIcingPrice > 0) {
              $('#displayProductFlavor').append(new Option("Vanilla", "vanilla"))
              hasVanillaFlavor = true;
              if (result.vanillaFondantPrice > 0) {                
                $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
                hasFondant = true
              }
              if (result.vanillaIcingPrice > 0) {
                $('#displayProductFrosting').append(new Option("Icing", "icing"))
                hasIcing = true
              }
            }

            if (result.chocolateFondantPrice > 0 || result.chocolateIcingPrice > 0) {
              $('#displayProductFlavor').append(new Option("Chocolate", "chocolate"))
              hasChocolateFlavor = true
              if(!hasFondant && !hasVanillaFlavor && result.chocolateFondantPrice > 0) {
                $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
                hasFondant = true
              }
              if(!hasIcing && !hasVanillaFlavor && result.chocolateIcingPrice > 0) {
                $('#displayProductFrosting').append(new Option("Icing", "icing"))
                hasIcing = true
              }
            }

            if (result.redvelvetFondantPrice > 0 || result.redvelvetIcingPrice > 0) {
              $('#displayProductFlavor').append(new Option("Red Velvet", "redVelvet"))
              if(!hasFondant && !hasVanillaFlavor && !hasChocolateFlavor && result.redvelvetFondantPrice > 0) {
                $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
              }
              if(!hasFondant && !hasVanillaFlavor && !hasChocolateFlavor && result.redvelvetIcingPrice > 0) {
                $('#displayProductFrosting').append(new Option("Icing", "icing"))
              }
            }

            var frostingSelected = $('#displayProductFrosting').find(":selected").val();
            if (hasVanillaFlavor) {
              if (frostingSelected == "fondant") {
                $('#displayProductPrice').text(result.vanillaFondantPrice)
              }
              if (frostingSelected == "icing") {
                $('#displayProductPrice').text(result.vanillaIcingPrice) 
              }             
            } else if (hasChocolateFlavor) {              
              if (frostingSelected == "fondant") {
                $('#displayProductPrice').text(result.chocolateFondantPrice)
              }
              if (frostingSelected == "icing") {
                $('#displayProductPrice').text(result.chocolateIcingPrice)
              }
            } else {
              if (frostingSelected == "fondant") {
                $('#displayProductPrice').text(result.redvelvetFondantPrice)
              }
              if (frostingSelected == "icing") {
                $('#displayProductPrice').text(result.redvelvetIcingPrice)
              }
            }

            $('#displayProductFlavor').change(function() {
              updateAvailableCupcakeFrosting(result)
              updateCupcakePrice(result)
            })
            $('#displayProductFrosting').change(function() {
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

    function updateAvailableCakeSize(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      $('#displayProductSize').find('option').remove()
      if (currentFlavor == "vanilla") {
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
        if (currentFlavor == 'vanilla' && currentSize == '6x5') {
            $('#displayProductPrice').text(result.vanilla6x5Price)
        } else if (currentFlavor == 'chocolate' && currentSize == '6x5'){
            $('#displayProductPrice').text(result.chocolate6x5Price)
        } else if (currentFlavor == 'vanilla' && currentSize == '8x5') {
            $('#displayProductPrice').text(result.vanilla8x5Price)
        } else {
            $('#displayProductPrice').text(result.chocolate8x5Price)
        }
    }

    function updateAvailableCupcakeFrosting(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      $('#displayProductFrosting').find('option').remove()
      if (currentFlavor == 'vanilla') {
        if (result.vanillaFondantPrice > 0) {
          $('#displayProductFrosting').append(new Option("Fondant", "fondant"))             
        }
        if (result.vanillaIcingPrice > 0) {
          $('#displayProductFrosting').append(new Option("Icing", "icing"))
        }
      } else if (currentFlavor == 'chocolate') {
        if (result.chocolateFondantPrice > 0) {
          $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
        }
        if (result.chocolateIcingPrice > 0) {
          $('#displayProductFrosting').append(new Option("Icing", "icing"))
        }
      } else {
        if (result.redvelvetFondantPrice > 0) {
          $('#displayProductFrosting').append(new Option("Fondant", "fondant"))
        }
        if (result.redvelvetIcingPrice > 0) {
          $('#displayProductFrosting').append(new Option("Icing", "icing"))
        }
      }
    }
  
    function updateCupcakePrice(result) {
        var currentFlavor = $('#displayProductFlavor').val()
        var currentFrosting = $('#displayProductFrosting').val()
        if (currentFlavor == 'vanilla' && currentFrosting == 'fondant') {
            $('#displayProductPrice').text(result.vanillaFondantPrice)
        } else if (currentFlavor == 'chocolate' && currentFrosting == 'fondant') {
            $('#displayProductPrice').text(result.chocolateFondantPrice)
        } else if (currentFlavor == 'redVelvet' && currentFrosting == 'fondant'){
            $('#displayProductPrice').text(result.redvelvetFondantPrice)
        } else if (currentFlavor == 'vanilla' && currentFrosting == 'icing') {
            $('#displayProductPrice').text(result.vanillaIcingPrice)
        } else if (currentFlavor == 'chocolate' && currentFrosting == 'icing'){
            $('#displayProductPrice').text(result.chocolateIcingPrice)
        } else {
            $('#displayProductPrice').text(result.redvelvetIcingPrice)
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