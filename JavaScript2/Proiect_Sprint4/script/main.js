var $tabel ;
var $form ;
var $paginare ;
var $container ;
var currentPage = 1;
var totalPages = 0;
var sortField = "";
var sortDir = "";

var onSubmit = function () {
    var data = getFormData();
    var $errors = $form.find("#errors");
    var erori = validateData(data.name, data.stars);

    $form.find("#cancel").addClass("hide");

    if(erori != ""){
        $errors.attr("class","");
        $errors.val(erori);
    }else {
        $errors.attr("class","hide");
        store.add(data).then(function () {
            drawTable();
            $form.find("#checkEdit").val(0);
        });
    }
    clearInputs();
    return false;
};

var getFormData = function () {
    var city = $form.find("#city").val();
    var visited = $form.find("#checkbox").is(":checked");
    var stars = $form.find("#result").val();
    var dataObj = {
        name: city,
        visited: visited ? 1 : 0,
        stars: parseInt(stars)
    }
    return dataObj;
};

var validateData = function (city, stars) {
    var error = ""
    if(!checkLength(city)){
        error = "Introduce-ti un oras";
    }else if(!checkStars(stars)){
        error = "Introduce-ti un rating";
    }
    return error;
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
            totalPages = data.totalPages;
            $paginare.find("#totalPages").text(totalPages);

            if (currentPage <= totalPages) {
                if (data.list.length > 0) {
                    $("tfoot").attr("class", "hide");
                    populate(data.list);
                }else {
                    $("tfoot").attr("class", "");
                }
            }else {
                currentPage = totalPages;
                $paginare.find("#page_number").text(currentPage);
                drawTable();
            }
            createPages();
            hideLoader();
        },
        function (data) {
            alert(data.error);
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

var deleteClicked = function () {
    var id = $(this).closest("tr").data("id");

    showLoader();

    store.delete(id).then(function () {
            drawTable();
            clearInputs();
            hideLoader();
        },
        function (data) {
            alert(data.error);
        });
};

var editClicked = function () {
    var id = $(this).closest("tr").data("id");

    showLoader();
    $form.find("#checkEdit").val(id);
    $form.find("#cancel").removeClass("hide");
    $form.find("#submit").removeClass("hide");
    $form.find("#save").addClass("hide");

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
        },
        function (data) {
            alert(data.error);
        });
};

var attachEvents = function () {
    $tabel.find("tbody .remove").confirm( {
        message: "Are you sure?",
        onConfirm: deleteClicked,
        onReject: function (){
        }
    });

    $tabel.find("tbody .edit").on("click", editClicked);
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

var selectPages = function (start, end) {
    for(var i = end; i > start; i--){
        $('<li><a href="#" class="prevnext pages btn">'+ i +'</a></li>').insertAfter($paginare.find("ul #prev-li"));
    }
};

var createPages = function () {
    var $listaPagini = $paginare.find("ul");

    $listaPagini.empty();
    $listaPagini.append('<li><a href="#" id="first" class="prevnext btn">First</a></li>');
    $listaPagini.append('<li id="prev-li"><a href="#" id="prev" class="prevnext btn"><<</a></li>');
    $listaPagini.append('<li><a href="#" id="next" class="prevnext btn">>></a></li>');
    $listaPagini.append('<li><a href="#" id="last" class="prevnext btn">Last</a></li>');

    if(totalPages <= 5){
        selectPages(0, totalPages);
    }else if(currentPage < 3){
        selectPages(0, 5);
    }else if (currentPage > totalPages-3){
        selectPages(totalPages-5, totalPages);
    }else{
        selectPages(currentPage-3, currentPage+2);
    }

    $paginare.find("#prev").click(function () {
        if(currentPage >1){
            currentPage-=1;
            $paginare.find("#page_number").text(currentPage);
            drawTable();
        }
    });
    $paginare.find("#next").click(function () {
        if(currentPage < totalPages){
            currentPage+=1;
            $paginare.find("#page_number").text(currentPage);
            drawTable();
        }
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
        currentPage = totalPages;
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
    var $giphyIframe = $container.find("#giphy iframe");
    var urlGiphy= "http://api.giphy.com/v1/gifs/search?q="+name+"&api_key=dc6zaTOxFJmzC&limit=5";
    var embedUrl = "";
    var xhr = $.get(urlGiphy);

    showLoader();
    $giphyIframe.prop("src","");

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
    }else {
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
    $form.find("#result").stars();
    $form.submit(onSubmit);

    $form.find("#submit").click(function () {
        var locData = getFormData();

        showLoader()

        store.update($form.find("#checkEdit").val(), locData).then(function () {
                drawTable();
                $form.find("#checkEdit").val(0);
                $form.find("#submit").addClass("hide");
                $form.find("#cancel").addClass("hide");
                $form.find("#save").removeClass("hide");
                hideLoader();
            },
            function (data) {
                hideLoader();
                alert(data.error);
            });
        clearInputs();
    });
    $form.find("#cancel").click(function () {
        clearInputs();
        $form.find("#checkEdit").val(0);
        $form.find("#cancel").addClass("hide");
        $form.find("#submit").addClass("hide");
        $form.find("#save").removeClass("hide");
    });
    $tabel.find("th").click(function (event) {
        sortDir = $(event.target).data("sort");
        sortField = $(event.target).data("field");
        drawTable();
        setSortArrows(this, event.target);
        return false;
    });
});