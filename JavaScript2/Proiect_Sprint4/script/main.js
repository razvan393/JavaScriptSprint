var $page = $("#page");
var $checkEdit = $("#checkEdit");
var currentPage = 1;
var totalPages = 0;
var sortField = "";
var sortDir = "";

var onSubmit = function () {
    showLoader();
    var data = getFormData();
    var $errors = $("#errors");

    $("#cancel").attr("type", "hidden");
    if(typeof data == "string"){
        $errors.attr("class","");
        $errors.val(data);
    }
    else{
        $errors.attr("class","hide");
        if (isNaN($checkEdit.val())) {
            store.update($checkEdit.val(), data).then(function () {
                drawTable();
                $checkEdit.val(0);
                hideLoader();
            });
        }
        else {
            store.add(data).then(function () {
                drawTable();
                $checkEdit.val(0);
                hideLoader();
            });
        }
    }
};

var getFormData = function () {
    var city = $("[name=city]").val();
    var visited = $("[name=checkbox]").is(":checked");
    var stars = $("#result").val();
    var dataObj;

    if (!checkLength(city)){
        dataObj = "Introduce-ti un oras";
        return dataObj;
    }
    else if (!checkStars(stars)) {
        dataObj = "Introduce-ti un rating";
        return dataObj;
    }
    else{
        dataObj = {
            name: city,
            visited: visited ? 1 : 0,
            stars: parseInt(stars)
        };
        clearInputs();
        return dataObj;
    }
};

var checkLength = function (name) {
    return name.length ? true : false;
};

var checkStars = function (number) {
    return (number > 0);
};

var drawTable = function () {
    showLoader();
    $("#the-table tbody").empty();
    store.getAll(currentPage,5,sortField,sortDir).then(function (data) {
        $("#numarPagini").attr("value",data.totalPages);
        totalPages = data.totalPages;
        $("#totalPages").text(totalPages);
        if (currentPage <= totalPages) {
            if (data.list.length > 0) {
                $("tfoot").attr("class", "hide");
                populate(data.list);
            }
            else {
                $("tfoot").attr("class", "");
            }
            hideLoader();
        }
        else{
            currentPage = totalPages;
            $page.text(currentPage);
            drawTable();
        }
    });
};

var populate = function (data) {
    $.each(data, function (index, element) {
        var stele ="";
        for (var i=1; i<= element.stars; i++)
        {
            stele = stele + "&#9733;";
        }
        $("#the-table tbody").append(tmpl("tpl", {
            id: element.id,
            city: element.name,
            stars: stele,
            visited: element.visited
        }));
    });
    attachEvents(data);
};

var attachEvents = function (data) {
    $("table tbody .remove").confirm( {
        message: "Are you sure?",
        onConfirm: function () {
            showLoader();
            var id = $(this).closest("tr").data("id");
            store.delete(id).then(function () {
                drawTable();
                clearInputs();
                hideLoader();
            });
        },
        onReject: function (){
        }
    });

    $("table tbody .edit").on("click", function () {
        showLoader();
        var id = $(this).closest("tr").data("id");
        $checkEdit.val(id);
        $("#cancel").attr("type", "button");
        store.get(id).then(function (data) {
            $("#city").val(data.name);
            $("#result").val(data.stars).change();

            if (data.visited == 1) {
                $("#checkbox").prop('checked', true);
            }
            else {
                $("#checkbox").prop('checked', false);
            }
            hideLoader();
        });
    });
    $("tr").on("click", function () {
        var giphyName = ($(this).data("name"));
        giphy(giphyName);
    });
    $("#close").on("click", function () {
       $("#giphy").attr("class","hide");
    });
};

var clearInputs = function () {
    $("#city").val('');
    $("#checkbox").attr('checked', false);
    $("#result").val(0).change();
};

var colorStars = function() {
    $('[name="review"]').stars();
};

var prev = function () {
    if(currentPage >1){
        currentPage-=1;
        $page.text(currentPage);
        drawTable();
    }
};

var next = function () {
    var totalPages = parseInt($("#numarPagini").attr("value"));
    if(currentPage < totalPages){
        currentPage+=1;
        $page.text(currentPage);
        drawTable();
    }
};

var showLoader = function () {
    $("#loader").attr("class","loader");
    $("inputs").prop("readonly", true);
};

var hideLoader = function () {
    $("#loader").attr("class","hide");
    $("inputs").prop("readonly", false);
}

var giphy = function (name) {
    $("iframe").prop("src","")
    var urlGiphy= "http://api.giphy.com/v1/gifs/search?q="+name+"&api_key=dc6zaTOxFJmzC&limit=5"
    var xhr = $.get(urlGiphy);
    var embedUrl
    xhr.done(function(data) {
        if(data.data[0]){
            embedUrl = data.data[0].embed_url;
        }
        else{
            embedUrl = "http://giphy.com/embed/10oRQhnkcc72Le";
        }
        $("iframe").prop("src", embedUrl);
        $("#giphy").attr("class","");
    });
};

$(document).ready(function () {
    drawTable(parseInt($page.text()));
    colorStars();
    $('#myForm').submit(function () {
        onSubmit();
        return false;
    });
    $("#cancel").click(function () {
        clearInputs();
        $("#checkEdit").val(0);
        $("#cancel").attr("type", "hidden");
    });
    $("#prev").click(function () {
        prev();
    });
    $("#next").click(function () {
        next();
    });
    $("#h-city").on("click",function () {
        sortDir = "desc";
        sortField = "name";
        drawTable();
        return false;
    });
    /*$("#last-city").on("click",function () {
     console.log($("#last-city"));
     store.getAll(currentPage,5,"name","desc").then(function () {
     drawTable();
     return false;
     });
     });*/
    /*$("#h-stars").click(function () {
     store.getAll(currentPage,5,"stars","asc").then(function () {
     drawTable();
     });
     });
     $("#h-stars").dblclick(function () {
     store.getAll(currentPage,5,"stars","desc").then(function () {
     drawTable();
     });
     });
     $("#h-visited").click(function () {
     store.getAll(currentPage,5,"visited","asc").then(function () {
     drawTable();
     });
     });
     $("#h-visited").dblclick(function () {
     store.getAll(currentPage,5,"visited","desc").then(function () {
     drawTable();
     });
     });*/
});