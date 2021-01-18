// ViewModel KnockOut


// ViewModel KnockOut
var vm = function () {
  console.log('ViewModel initiated...');
  //---Variáveis locais
  var self = this;
  self.baseUri = ko.observable('http://192.168.160.58/netflix/api/titles');
  self.displayName = 'Titles List';
  self.error = ko.observable('');
  self.passingMessage = ko.observable('');
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(20);
  self.totalRecords = ko.observable(50);
  self.hasPrevious = ko.observable(false);
  self.hasNext = ko.observable(false);
  self.previousPage = ko.computed(function () {
      return self.currentPage() * 1 - 1;
  }, self);
  self.nextPage = ko.computed(function () {
      return self.currentPage() * 1 + 1;
  }, self);
  self.fromRecord = ko.computed(function () {
      return self.previousPage() * self.pagesize() + 1;
  }, self);
  self.toRecord = ko.computed(function () {
      return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
  }, self);
  self.totalPages = ko.observable(0);
  self.pageArray = function () {
      var list = [];
      var size = Math.min(self.totalPages(), 9);
      var step;
      if (size < 9 || self.currentPage() === 1)
          step = 0;
      else if (self.currentPage() >= self.totalPages() - 4)
          step = self.totalPages() - 9;
      else
          step = Math.max(self.currentPage() - 5, 0);

      for (var i = 1; i <= size; i++)
          list.push(i + step);
      return list;
  };
  //--- Page Events
  self.activate = function (id) {
      console.log('CALL: getTitle...');
      var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
      ajaxHelper(composedUri, 'GET').done(function (data) {
          console.log(data);
          hideLoading();
          self.records(data.Titles);
          self.currentPage(data.CurrentPage);
          self.hasNext(data.HasNext);
          self.hasPrevious(data.HasPrevious);
          self.pagesize(data.PageSize)
          self.totalPages(data.TotalPages);
          self.totalRecords(data.TotalTitles);
          //self.SetFavourites();
      });
  };
  //--- Internal functions
  function ajaxHelper(uri, method, data) {
      self.error(''); // Clear error message
      return $.ajax({
          type: method,
          url: uri,
          dataType: 'json',
          contentType: 'application/json',
          data: data ? JSON.stringify(data) : null,
          error: function (jqXHR, textStatus, errorThrown) {
              console.log("AJAX Call[" + uri + "] Fail...");
              hideLoading();
              self.error(errorThrown);
          }
      });

  }
  function showLoading() {
      $('#myModal').modal({
          backdrop: 'static',
          keyboard: false
      });
  }
  function hideLoading() {
      $('#myModal').on('shown.bs.modal', function (e) {
          $("#myModal").modal('hide');
      })
  }

  function getUrlParameter(sParam) {
      var sPageURL = window.location.search.substring(1),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;

      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
          }
      }
  };
  //--- start ....
  showLoading();
  var pg = getUrlParameter('page');
  console.log(pg);
  if (pg == undefined)
      self.activate(1);
  else {
      self.activate(pg);
  }
};


//modal pop-up when the user clicks on a movie card
$('.swiper-slide').click(function(event) {
    event.preventDefault();
    this.blur(); // Manually remove focus from clicked link.
  $.get(this.href,  function(html) {
    $(html).appendTo('body').modal();
  });
});
$('#movie-card').modal('show')


//nav-bar to transparent
$(window).scroll(function(){
    $('nav').toggleClass('scrolled', $(this).scrollTop() > 100);
});

//

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

// $("#searchBar").autocomplete({
//     minLength: 4,
//     source: function(request, response) {
//       $.ajax({
//         type: "GET",
//         url: "http://192.168.160.58/netflix/api/api/Search/Titles?name={name}",
//         data: "{'name':'"+ $('#searchBar').val() + "'}",
//         dataType: "json",
//         success: function(data) {
//           console.log(data)
//         response(data);
//       },
//       error: function(result) {
//         alert(result.statusText);
//       }
//     });
//   }});

  $("#searchBar").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "http://192.168.160.58/netflix/api/Search/Titles",
            type: 'get',
            dataType:'json',
            data:{
                'name': request.term
            },
        }).done(data =>{
            console.log(data)
        })
    }
});

$(document).ready(function () {
  console.log(viewModel)
  ko.applyBindings(viewModel);
  console.log("ready!");
  ko.applyBindings(new vm());

});



data-bind="click: addFavourite.bind($data, id)"

self.addFavorite(id){
    console.log(id);
}