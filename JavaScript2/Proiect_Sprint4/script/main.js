$(document).ready(function () {
    var currentPage = parseInt($("#page").text());
    drawTable(currentPage);
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
});

var onSubmit = function () {
    var data = getFormData();
    var checkEdit = $("#checkEdit").val();
    var $errors = $("#errors");

    $("#cancel").attr("type", "hidden");
    if(typeof data == "string"){
        $errors.attr("class","");
        $errors.val(data);
    }
    else{
        $errors.attr("class","hide");
        if (isNaN(checkEdit)) {
            store.update(checkEdit, data);
        }
        else {
            store.add(data);
        }
        $("#checkEdit").val(0);
    }
};

var getFormData = function () {
    var city = $("[name=city]").val();
    var visited = $("[name=checkbox]").is(":checked");
    var stars = $("#result").val();
    var dataObj;

    if (!checkLength(city)){
        dataObj = "Introduce-ti un nume de oras";
        return dataObj;
    }
    else if(!checkCity(city)) {
        dataObj = "Introduce-ti un oras valid";
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

var checkCity = function (name) {
    return name.match('^[a-zA-Z]{2,20}$');
};

var checkStars = function (number) {
    return (number > 0);
};

var drawTable = function (id) {
    $("#the-table tbody").empty();
    store.getAll(id).then(function (data) {
        $("#numarPagini").attr("value",data.totalPages);
        if (data.list.length > 0) {
            $("tfoot").attr("class","hide");
            populate(data.list);
        }
        else {
            $("tfoot").attr("class","");
        }
    });

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
};

var attachEvents = function (data) {
    $("table tbody .remove").confirm( {
        message: "Are you sure?",
        onConfirm: function () {
            var id = $(this).closest("tr").data("id");
            store.delete(id);
            clearInputs();
        },
        onReject: function (){
        }
    });

    $("table tbody .edit").on("click", function () {
        var id = $(this).closest("tr").data("id");
        $("#checkEdit").val(id);
        $("#cancel").attr("type", "button");
        store.get(id);
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
    var currentPage = parseInt($("#page").text());
    if(currentPage >1){
        currentPage-=1;
        $("#page").text(currentPage);
        drawTable(currentPage);
    }
};

var next = function () {
    var currentPage = parseInt($("#page").text());
    var totalPages = parseInt($("#numarPagini").attr("value"));
    if(currentPage < totalPages){
        currentPage+=1;
        $("#page").text(currentPage);
        drawTable(currentPage);
    }
};
