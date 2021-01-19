const viewModel = {
    movies: [
        { 
            imgUrl: "public/imgs/image_movie.png", 
            slideNum: 'slide 1'
        },
        { 
            imgUrl: 'public/imgs/image_movie-2.png', 
          slideNum: 'slide 2'
          
        },
        { 
            imgUrl: 'public/imgs/image_movie-3.png', 
            slideNum: 'slide 3'
            
        },
        { 
            imgUrl: 'public/imgs/image_movie-4.png', 
            slideNum: 'slide 4'
            
        },
        { 
            imgUrl: 'public/imgs/image_movie-5.png', 
            slideNum: 'slide 5'
        },
        { 
            imgUrl: 'public/imgs/image_movie-6.png', 
            slideNum: 'slide 6' 
        },
        { 
            imgUrl: 'public/imgs/image_movie-7.png', 
            slideNum: 'slide 7'
        },
        { 
            imgUrl: 'public/imgs/image_movie-8.png', 
            slideNum: 'slide 8'
        },
        { 
            imgUrl: 'public/imgs/image_movie-9.png', 
            slideNum: 'slide 9'
        },
        { 
            imgUrl: 'public/imgs/image_movie-10.png', 
            slideNum: 'slide 10'
        }
    ]
}

        
        // const settings = {
          //   "async": true,
          //   "crossDomain": true,
          //   "url": "https://unogsng.p.rapidapi.com/images?netflixid=81037848&offset=3&limit=2",
          //   "method": "GET",
          //   "headers": {
            //     "x-rapidapi-key": "d8d5a56404msh192545404e9c9f8p1d2548jsn8b9c8587e074",
            //     "x-rapidapi-host": "unogsng.p.rapidapi.com"
            //   }
            // };
            
            // $.ajax(settings).done(function (response) {
              //   console.log(response);
              // });

            
            // try {
              //   const response = await fetch("https://netflix-unofficial.p.rapidapi.com/api/directors", {
                //       "headers": {
                  //         "x-rapidapi-key": "d8d5a56404msh192545404e9c9f8p1d2548jsn8b9c8587e074",
                  //         "x-rapidapi-host": "netflix-unofficial.p.rapidapi.com"
                  //       }
                  //   })
                  //   const data = response.json();
                  //   console.log(data)
                  // } catch (error) {
                    //   console.error(error);         
                    // }

$(document).ready(function () {
    
    console.log(viewModel)
    ko.applyBindings(viewModel);

    //slider
    let swiper = new Swiper('.swiper-container', {
        slidesPerView: 6,
        spaceBetween: 10,
        slidesPerGroup: 2,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });

    $("#searchBar").autocomplete({
        minLength: 3,
        source: function(request, response) {
            $.ajax({
                url: "http://192.168.160.58/netflix/api/Search/Titles",
                type: 'get',
                dataType:'json',
                data:{
                    'Name': request.term
                },
            }).done(data =>{
                // console.log(data)
                let i=0
                response($.each(data, (key, item) => {
                    i++;
                    if(i<11) return ({label:item.Name})
                }))
            })
        }
    });

    //modal pop-up when the user clicks on a movie card
    // $('.swiper-slide').click(function(event) {
    //     event.preventDefault();
    //     this.blur(); // Manually remove focus from clicked link.
    //     $('#movie-card').modal('show')
    //     $.get(this.href,  function(html) {
    //         $(html).appendTo('body').modal();
    // });
    // });


    //nav-bar to transparent
    $(window).scroll(function(){
        $('nav').toggleClass('scrolled', $(this).scrollTop() > 100);
    });
});


