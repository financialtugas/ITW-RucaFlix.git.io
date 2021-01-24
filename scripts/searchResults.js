// ViewModel KnockOut

var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/netflix/api/Search/Titles');

    self.TitlesSearch = ko.observableArray([])
    self.titleSearch = ko.observable()
    
    self.displayName = 'Search Results List';
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


    self.autocomplete = function(){
        $("#searchBar").autocomplete({
            minLength: 3,
            source: function(request, response) {
                self.titleSearch(request.term) 
                $.ajax({
                    url: "http://192.168.160.58/netflix/api/Search/Titles",
                    type: 'get',
                    dataType:'json',
                    data:{
                        'name': request.term
                    },
                }).done(data =>{
                    console.log(data)
                    response($.map(data, item  => {                    
                        self.TitlesSearch.push(item)
                        console.log(item.Name)
                        return {label:item.Name} 
                    }))
                })
            }
        });
        console.log(self.TitlesSearch());
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getTitle...');
        console.log(self.baseUri()) 
        var composedUri = self.baseUri() + "?name=" + self.titleSearch() +"&page=" + id + "&pageSize=" + self.pagesize();
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
    

    self.search = function(){

    }
    // $.ajax({
    //     url: 'http://192.168.160.58/netflix/api/Search/Titles?name=' + self.titleSearch(),
    //     type: 'GET',
    //     dataType: 'json',

    //     success: function(data){
    //         if (data.length == 0){
    //             self.records([]);
    //             $("#NoResults").html("Sorry... we don't have that title!" + "<i style='padding-left:2%' class='fa fa-frown-o fa-2x' aria-hidden='true'></i>");
    //             $("#NoResults").removeClass("d-none");
    //             $("#reset").removeClass("d-none");
    //         }

    //         else{
    //         self.records(data);
    //         $("#NoResults").addClass("d-none");
    //         self.records(data);
    //         $("#NoResults").addClass("d-none");
    //         console.log("He added")
    //         $(".pagination").addClass("d-none");
    //         $("#select").addClass("d-none");
    //         $("#span1").addClass("d-none");
    //         $("#span2").addClass("d-none");
    //         $("#reset").removeClass("d-none");
    //         self.TitlesSearch(self.records().length);
    //         $("#total_search").removeClass("d-none");
    //         }
    //     },

    //     error: function(){
    //         console.log("Error has occured");
    //     }
    // });  

    // self.reset = function(){
    //     console.log("Resetting Search...")
    //     self.titleSearch('');
    //     $(".pagination").removeClass("d-none");
    //     $("#select").removeClass("d-none");
    //     $("#span1").removeClass("d-none");
    //     $("#span2").removeClass("d-none");
    //     $("#reset").addClass("d-none");
    //     $("#total_search").addClass("d-none");
    //     $('#searchbtn').attr('disabled', true);
    //     $("#NoResults").addClass("d-none");
    //     $("#footer").addClass('d-none');
    //     var page = getUrlParameter('page')
    //     if (page == undefined){
    //         self.activate(1);
    //     }
    //     else {
    //         self.activate(page)
    //     }
        
    // }

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        console.log(uri);
        console.log(data);
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
            if (sParameterName[0] === sParam) {1
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

$(document).ready(function () {
    $(window).scroll(function(){
        $('nav').toggleClass('scrolled', $(this).scrollTop() > 100);
    });
    console.log("ready!");
    ko.applyBindings(new vm());
});



//ADD TO FAVORITES


// data-bind="click: addFavourite.bind($data, id)"

// self.addFavorite(id){
    // }
    
    // self.addFavorite = ko.computed((data, id) =>{
        
    //     return self.likesMovies.push(id);
    // }, self)

    // self.addFavorite = () => {
    //     console.log(id);
    //     return self.likesMovies.push(id);
    // }
//     likeMovies.push(Id);
// localStorage.setItem('LikesMovies', likesMovies);

// localStorage.setItem('myCat', 'Tom');