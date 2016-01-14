var $tabel ;
var $form ;
var $paginare ;
var $container ;
var currentPage = 1;
var totalPages = 0;
var sortField = "";
var sortDir = "";

var onSubmit = function () {
    showLoader();
    var data = getFormData();
    var $errors = $form.find("#errors");

    $form.find("#cancel").attr("type", "hidden");
    if(typeof data == "string"){
        $errors.attr("class","");
        $errors.val(data);
    }
    else{
        $errors.attr("class","hide");
        if (isNaN($form.find("#checkEdit").val())) {
            store.update($form.find("#checkEdit").val(), data).then(function () {
                drawTable();
                $form.find("#checkEdit").val(0);
                hideLoader();
            });
        }
        else {
            store.add(data).then(function () {
                drawTable();
                $form.find("#checkEdit").val(0);
                hideLoader();
            });
        }
    }
};

var getFormData = function () {
    var city = $form.find("#city").val();
    var visited = $form.find("#checkbox").is(":checked");
    var stars = $form.find("#result").val();
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
    $tabel.find("tbody").empty();
    store.getAll(currentPage,sortField,sortDir).then(function (data) {
        $paginare.find("#numarPagini").attr("value",data.totalPages);
        totalPages = data.totalPages;
        $paginare.find("#totalPages").text(totalPages);
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
            $paginare.find("#page_number").text(currentPage);
            drawTable();
        }
        createPages();
    });
};

var populate = function (data) {
    $.each(data, function (index, element) {
        var stele ="";

        for (var i=1; i<= element.stars; i++)
        {
            stele = stele + "&#9733;";
        }
        $tabel.find("tbody").append(tmpl("tpl", {
            id: element.id,
            city: element.name,
            stars: stele,
            visited: element.visited
        }));
    });
    attachEvents(data);
};

var attachEvents = function (data) {
    $tabel.find("tbody .remove").confirm( {
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

    $tabel.find("tbody .edit").on("click", function () {
        showLoader();
        var id = $(this).closest("tr").data("id");

        $form.find("#checkEdit").val(id);
        $form.find("#cancel").attr("type", "button");
        store.get(id).then(function (data) {
            $form.find("#city").val(data.name);
            $form.find("#result").val(data.stars).change();
            if (data.visited == 1) {
                $form.find("#checkbox").prop('checked', true);
            }
            else {
                $form.find("#checkbox").prop('checked', false);
            }
            hideLoader();
        });
    });
    $tabel.find(".city").on("click", function () {
        var giphyName = ($(this).closest("tr").data("name"));
        giphy(giphyName);
    });
    $container.find("#giphy").on("click", function () {
        $container.find("#giphy-container").attr("class","hide");
    });
};

var clearInputs = function () {
    $form.find("#city").val('');
    $form.find("#checkbox").attr('checked', false);
    $form.find("#result").val(0).change();
};

var colorStars = function() {
    $form.find("#result").stars();
};

var prev = function () {
    if(currentPage >1){
        currentPage-=1;
        $paginare.find("#page_number").text(currentPage);
        drawTable();
    }
};

var next = function () {
    var totalPages = parseInt($paginare.find("#numarPagini").attr("value"));
    if(currentPage < totalPages){
        currentPage+=1;
        $paginare.find("#page_number").text(currentPage);
        drawTable();
    }
};

var selectPages = function (start, end) {
    for(var i = end; i > start; i--){
        $('<li><a href="#" class="prevnext pages btn">'+ i +'</a></li>').insertAfter($paginare.find("ul #prev-li"));
    }
};

var createPages = function () {
    var $listaPagini = $paginare.find("ul");
    var totalPages = $paginare.find("#numarPagini").val();

    $listaPagini.empty();
    $listaPagini.append('<li><a href="#" id="first" class="prevnext btn">First</a></li>');
    $listaPagini.append('<li id="prev-li"><a href="#" id="prev" class="prevnext btn"><<</a></li>');
    $listaPagini.append('<li><a href="#" id="next" class="prevnext btn">>></a></li>');
    $listaPagini.append('<li><a href="#" id="last" class="prevnext btn">Last</a></li>');
    if(totalPages <= 5){
        selectPages(0, totalPages);
    }
    else if(currentPage < 3){
        selectPages(0, 5);
    }
    else if (currentPage > totalPages-3){
        selectPages(totalPages-5, totalPages);
    }
    else{
        selectPages(currentPage-3, currentPage+2);
    }
    $paginare.find("#prev").click(function () {
        prev();
    });
    $paginare.find("#next").click(function () {
        next();
    })
    $paginare.find(".pages").click(function () {
        currentPage = parseInt($(this).text());
        $paginare.find("#page_number").text(currentPage);
        drawTable();
    });
    $paginare.find("#first").click(function () {
        currentPage = 1;
        $paginare.find("#page_number").text(currentPage);
        drawTable();
    });
    $paginare.find("#last").click(function () {
        currentPage = $paginare.find("#numarPagini").val();
        $paginare.find("#page_number").text(currentPage);
        drawTable();
    });
};

var showLoader = function () {
    $container.find("#loader").attr("class","");
    $("inputs").prop("readonly", true);
};

var hideLoader = function () {
    $container.find("#loader").attr("class","hide");
    $("inputs").prop("readonly", false);
}

var giphy = function (name) {
    showLoader();
    var $giphyIframe = $container.find("#giphy iframe");
    $giphyIframe.prop("src","");
    var urlGiphy= "http://api.giphy.com/v1/gifs/search?q="+name+"&api_key=dc6zaTOxFJmzC&limit=5";
    var embedUrl = "";
    var xhr = $.get(urlGiphy);
    xhr.done(function(data) {
        if(data.data[0]){
            embedUrl = data.data[0].embed_url;
        }
        else{
            embedUrl = "https://giphy.com/embed/10oRQhnkcc72Le";
        }
        $giphyIframe.prop("src", embedUrl);
        $container.find("#giphy-container").attr("class","");
        hideLoader();
    });
};

var setSortArrows = function (event, name) {
    if($(name).data("sort") == "asc"){
        $(name).data("sort","desc");
        $tabel.find(".arrow-down, .arrow-up").removeClass("hide");
        $(event).find(".arrow-down").addClass("hide");
    }
    else{
        $(name).data("sort","asc")
        $tabel.find(".arrow-down, .arrow-up").removeClass("hide");
        $(event).find(".arrow-up").addClass("hide");
    }
}

$(document).ready(function () {
    $tabel = $("#the-table");
    $form = $("#myForm");
    $paginare = $(".pagination");
    $container = $(".container");

    drawTable(parseInt($paginare.find("#page_number").text()));
    colorStars();
    $form.submit(function () {
        onSubmit();
        return false;
    });
    $form.find("#cancel").click(function () {
        clearInputs();
        $form.find("#checkEdit").val(0);
        $form.find("#cancel").attr("type", "hidden");
    });
    $tabel.find("#h-city").click(function () {
        sortDir = $tabel.find("#h-city").data("sort");
        sortField = "name";
        drawTable();
        setSortArrows(this, "#h-city");
        return false;
    });
    $tabel.find("#h-stars").click(function () {
        sortDir = $tabel.find("#h-stars").data("sort");
        sortField = "stars";
        drawTable();
        setSortArrows(this, "#h-stars");
        return false;
    });
    $tabel.find("#h-visited").click(function () {
        sortDir = $tabel.find("#h-visited").data("sort");
        sortField = "visited";
        drawTable();
        setSortArrows(this, "#h-visited");
        return false;
    });
});