$(document).ready(function() {
    const soloCarousel = document.querySelectorAll(".productCarouselDisplay");
    const multiCarousel = document.querySelectorAll(".productBoxCarousel");
          
    function autoplay(main, controls) {return (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
            clearTimeout(timeout)
        }
        function nextTimeout() {
            clearTimeout(timeout)
            if (mouseOver) return
            timeout = setTimeout(() => {
                slider.next()
            }, 1000)
        }
        slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
                mouseOver = true
                clearNextTimeout()
            })
        
            slider.container.addEventListener("mouseout", () => {
                mouseOver = false
                nextTimeout()
            })

            $(controls).mouseover(() => {
                mouseOver = true
                clearNextTimeout()
            })

            $(controls).mouseout(() => {
                mouseOver = false
                nextTimeout()
            })
            nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
        }
    }

    
    var slider = new KeenSlider("#my-keen-slider", {loop: true},
        [
        autoplay(this.slider, ".soloCarouselBtn")
        ])

    $('.soloCarouselPrev').click(function() {
        slider.prev();
    })

    $('.soloCarouselNext').click(function() {
        slider.next();
    })
        
    var multi = new KeenSlider(
        "#multi",
    {
        loop: true,
        slides: {
        perView: 4,
        spacing: 10,
        },
    },
        [
        autoplay(this.multi, ".multiCarouselBtn")
        ]);

    $('.multiCarouselPrev').click(function() {
        multi.prev();
    })

    $('.multiCarouselNext').click(function() {
        multi.next();
    })
})