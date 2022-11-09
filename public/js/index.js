$(document).ready(function() {
    $(".menuBtn").click(function () {
      alert(this.name);
      window.location.replace("product.html");
    });

    $(".productBox").click(function() {
      document.querySelector('.modalBackground').style.display = 'flex';
    });

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