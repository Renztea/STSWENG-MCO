$(document).ready(function() {
    // Duplicate alert display when on click
    // Maybe need to display number Cake flavor
    $(".productBox").click(function() {      
      var productName = $(this).find('img').attr('placeholder');
      var productType = $(this).find('input').val();
      
      document.querySelector('.mainBackground').style.overflow = 'hidden';      

      $.get('/getProductInfo', {name: productName, type: productType}, function(result) {
        if (result) {
          $('#displayProductFlavor').unbind('change');
          $('#displayProductSize').unbind('change');
          $('#displayProductFrosting').unbind('change');

          $('#displayProductImage').attr('src', result.image);
          $('#displayProductName').text(result.name)
          $("#displayProductQuantity").val(1)
          $('#displayProductFlavor').find('option').remove()
          $('#displayProductSize').find('option').remove()
          $('#displayProductFrosting').find('option').remove()
          $('#displayProductDedication').val("")
          $('#displayProductCakeNumber').find('option').remove()
          $('#displayProductDesignNumber').find('option').remove()
          $(".orderDedicationContainer").hide()
          $('.orderFlavorContainer').hide()
          $('.orderSizeContainer').hide()
          $('.orderFrostingContainer').hide()
          $('.orderDedicationNote').hide()
          $('.orderCakeNumberContainer').hide()
          $('.orderDesignNumberContainer').hide()
          $('#displayProductDesign').val("")
          $('#productNote').text('Price varies depending on quantity.')  

          if (productType == 'Cake') {         
            var hasVanillaFlavor = false;
            var hasSize6x5 = false;
            var hasSize8x5 = false;

            if(result.numberCake) {
              $('#displayProductPrice').attr('data', result.numberCakePrice)
              $('#displayProductPrice').text(result.numberCakePrice)
              for (var i = 0; i < 10; i++) {
                $('#displayProductCakeNumber').append(new Option(i, i))
              }
              $('.orderCakeNumberContainer').show()
            } else {
              $('#productNote').text('Price varies depending on flavor, size, and quantity.')   
              $('.orderFlavorContainer').show()
              $('.orderSizeContainer').show()
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
              var productPrice = 0            
              if (hasVanillaFlavor) {
                if (sizeSelected == "6x5") {
                  //$('#displayProductPrice').text(result.vanilla6x5Price)
                  productPrice = result.vanilla6x5Price
                }
                if (sizeSelected == "8x5") {
                  //$('#displayProductPrice').text(result.vanilla8x5Price)
                  productPrice = result.vanilla8x5Price
                }             
              } else {              
                if (sizeSelected == "6x5") {
                  //$('#displayProductPrice').text(result.chocolate6x5Price)
                  productPrice = result.chocolate6x5Price
                }
                if (sizeSelected == "8x5") {
                  //$('#displayProductPrice').text(result.chocolate8x5Price)
                  productPrice = result.chocolate8x5Price
                }
              }

              if (result.dedication) {
                alert(result.dedication)
                $(".orderDedicationContainer").show()
                $('.orderDedicationNote').show()
              }

              $('#displayProductPrice').attr('data', productPrice)
              $('#displayProductPrice').text(productPrice)
              

              $('#displayProductFlavor').change(function() {
                updateAvailableCakeSize(result)
                updateCakePrice(result)
              })

              $('#displayProductSize').change(function() {
                updateCakePrice(result)
              })
            }
          } else if (productType == 'Cupcake') {
            $('#productNote').text('Price varies depending on flavor, frosting, and quantity.')   
            $('.orderFlavorContainer').show()
            $('.orderFrostingContainer').show()
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
            var productPrice = 0
            if (hasVanillaFlavor) {
              if (frostingSelected == "fondant") {
                //$('#displayProductPrice').text(result.vanillaFondantPrice)
                productPrice = result.vanillaFondantPrice
              }
              if (frostingSelected == "icing") {
                //$('#displayProductPrice').text(result.vanillaIcingPrice)
                productPrice = result.vanillaIcingPrice
              }             
            } else if (hasChocolateFlavor) {              
              if (frostingSelected == "fondant") {
                //$('#displayProductPrice').text(result.chocolateFondantPrice)
                productPrice = result.chocolateFondantPrice
              }
              if (frostingSelected == "icing") {
                //$('#displayProductPrice').text(result.chocolateIcingPrice)
                productPrice = result.chocolateIcingPrice
              }
            } else {
              if (frostingSelected == "fondant") {
                //$('#displayProductPrice').text(result.redvelvetFondantPrice)
                productPrice = result.redvelvetFondantPrice
              }
              if (frostingSelected == "icing") {
                //$('#displayProductPrice').text(result.redvelvetIcingPrice)
                productPrice = result.redvelvetIcingPrice
              }
            }

            for (var i = 0; i < 3; i++) {
              $('#displayProductDesignNumber').append(new Option(i + 1, i + 1))
            }

            $('.orderDesignNumberContainer').show()

            $('#displayProductPrice').attr('data', productPrice)
            $('#displayProductPrice').text(productPrice)

            $('#displayProductFlavor').change(function() {
              updateAvailableCupcakeFrosting(result)
              updateCupcakePrice(result)
            })
            $('#displayProductFrosting').change(function() {
              updateCupcakePrice(result)
            })
          } else {  
            for (var i = 0; i < 3; i++) {
              $('#displayProductDesignNumber').append(new Option(i + 1, i + 1))
            }

            $('.orderDesignNumberContainer').show()
            
            $('#displayProductPrice').attr('data', result.price)
            $('#displayProductPrice').text(result.price)
          }
          document.querySelector('.modalBackground').style.display = 'flex';
        }
      }).fail(function() {
        console.log('fail');
      })
    });

    function updateAvailableCakeSize(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      var sizeSelected = $('#displayProductSize').val()
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

      var currentSize = $('#displayProductSize').find('option[value=' + sizeSelected + ']').length
      if (currentSize > 0) {
        $('#displayProductSize').val(sizeSelected);
      }
    }
  
    function updateCakePrice(result) {
        var currentFlavor = $('#displayProductFlavor').val()
        var currentSize = $('#displayProductSize').val()
        var productPrice = 0
        if (currentFlavor == 'vanilla' && currentSize == '6x5') {
            //$('#displayProductPrice').text(result.vanilla6x5Price)
            productPrice = result.vanilla6x5Price
        } else if (currentFlavor == 'chocolate' && currentSize == '6x5'){
            //$('#displayProductPrice').text(result.chocolate6x5Price)
            productPrice = result.chocolate6x5Price
        } else if (currentFlavor == 'vanilla' && currentSize == '8x5') {
            //$('#displayProductPrice').text(result.vanilla8x5Price)
            productPrice = result.vanilla8x5Price
        } else {
            //$('#displayProductPrice').text(result.chocolate8x5Price)
            productPrice = result.chocolate8x5Price
        }

        updateDisplayPrice(productPrice)
    }

    function updateAvailableCupcakeFrosting(result) {
      var currentFlavor = $('#displayProductFlavor').val()
      var frostingSelected = $('#displayProductFrosting').val()
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

      var currentFrosting = $('#displayProductFrosting').find('option[value=' + frostingSelected + ']').length
      alert(frostingSelected + " " + currentFrosting)
      if (currentFrosting > 0) {
        $('#displayProductFrosting').val(frostingSelected);
      }
    }
  
    function updateCupcakePrice(result) {
        var currentFlavor = $('#displayProductFlavor').val()
        var currentFrosting = $('#displayProductFrosting').val()
        var productPrice = 0
        if (currentFlavor == 'vanilla' && currentFrosting == 'fondant') {
            //$('#displayProductPrice').text(result.vanillaFondantPrice)
            productPrice = result.vanillaFondantPrice
        } else if (currentFlavor == 'chocolate' && currentFrosting == 'fondant') {
           //$('#displayProductPrice').text(result.chocolateFondantPrice)
           productPrice = result.chocolateFondantPrice
        } else if (currentFlavor == 'redVelvet' && currentFrosting == 'fondant'){
            //$('#displayProductPrice').text(result.redvelvetFondantPrice)
            productPrice = result.redvelvetFondantPrice
        } else if (currentFlavor == 'vanilla' && currentFrosting == 'icing') {
            //$('#displayProductPrice').text(result.vanillaIcingPrice)
            productPrice = result.vanillaIcingPrice
        } else if (currentFlavor == 'chocolate' && currentFrosting == 'icing'){
            //$('#displayProductPrice').text(result.chocolateIcingPrice)
            productPrice = result.chocolateIcingPrice
        } else {
            //$('#displayProductPrice').text(result.redvelvetIcingPrice)
            productPrice = result.redvelvetIcingPrice
        }

        updateDisplayPrice(productPrice)
    }

    function updateDisplayPrice(productPrice) {
      var currentQuantity = $('#displayProductQuantity').val()

      if(currentQuantity > 100) {
        currentQuantity = 100
        $('#displayProductQuantity').val(100)
      } else if (currentQuantity <= 0) {
        currentQuantity = 1
        $('#displayProductQuantity').val(1)
      }

//      if(currentQuantity > 0) {
        var displayPrice = productPrice * currentQuantity
        
        alert("productPrice: " + productPrice)
        alert("currentQuantity: " + currentQuantity)
        alert("displayPrice: " + displayPrice)
        $('#displayProductPrice').attr('data', productPrice)
        $('#displayProductPrice').text(displayPrice)
//      }
    }
  
    $(".close").click(function() {
        document.querySelector('.mainBackground').style.overflow = 'auto';
        document.querySelector('.modalBackground').style.display = 'none';
    });
  
    $(".incdec").click(function() {
        var quantity = parseInt($(".orderQuantity").val());
        var productPrice = parseInt($('#displayProductPrice').attr('data'))
        
        if (isNaN(quantity))
            quantity = 0;
        
        if ($(this).attr('id') == 'increment') {
            quantity++;

            if(quantity > 100) {
              quantity = 100;
            }
        } else {
            quantity--;
            
            if (quantity <= 0)
                quantity = 1;
        }
        
        $(".orderQuantity").val(quantity);
        var displayPrice = productPrice * quantity
        $('#displayProductPrice').text(displayPrice)
    })
  
    $(".orderQuantity").keydown(function(e) {
        
        if(!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8  || e.keyCode == 46
            || (e.keyCode > 36 && e.keyCode < 41))) {
            console.log('That is illegal + ' + e.keyCode)
            return false;
        }
        /*
        if(!((e.keyCode > 47 && e.keyCode < 58) 
            || (e.keyCode > 95 && e.keyCode < 106) 
            || e.keyCode == 38 || e.keyCode == 40 
            || e.keyCode == 8 || e.keyCode == 46)) {
          console.log('That is illegal' + e.keyCode)
          return false
        } else {
          console.log('That is legal' + e.keyCode)
        }
        */
    })

    $('.orderQuantity').change(function() {
        var currentPrice = parseInt($('#displayProductPrice').attr('data'))

        updateDisplayPrice(currentPrice)
    })

    $(".addBtn").click(function() {
      $.post('/postBasketItem', 
            {name: $('#displayProductName').text(),
            image: $('#displayProductImage').attr('src'), 
            price: $('#displayProductPrice').attr('data'), 
            flavor: $('#displayProductFlavor').find(':selected').val() || "", 
            size: $('#displayProductSize').find(":selected").val() || "", 
            frosting: $('#displayProductFrosting').find(':selected').val() || "",
            cakeNumber: $('#displayProductCakeNumber').val() || "",
            designNumber: $('#displayProductDesignNumber').val() || "",
            quantity: $('#displayProductQuantity').val() || 1,
            dedication: $('#displayProductDedication').val() || "",
            design: $('#displayProductDesign').val() || "",
            type: $(this).val()
          }, function(result) {
            alert(result);
      }).fail(function() {

      })    
    })
  
});