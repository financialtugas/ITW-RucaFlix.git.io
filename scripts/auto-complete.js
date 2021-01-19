

$(document).ready(function () {
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
                let i=0;
                let array = []
                response($.each(data, (key, item) => {
                    i++;
                    array.push[item.Name];
                    if(i<11){
                        console.log(item.Name)
                        return ({label:item.Name}) 
                    } 
                }))
            })
        }
    });
});