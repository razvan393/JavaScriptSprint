$(document).ready(function () {
    drawTable();
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
});

var i = 4;

var onSubmit = function () {
    var data = getFormData();
    var checkEdit = $("#checkEdit").val();
    $("#cancel").attr("type", "hidden");
    if (checkEdit > 0) {
        store.update(checkEdit, data);
        drawTable();
    }
    else {
        store.add(data);
        drawTable();
    }
    $("#checkEdit").val(0);
};

var getFormData = function () {
    var city = $("[name=city]").val();
    var visited = $("[name=checkbox]").is(":checked");
    var stars = $("#result").val();
    var dataObj = {
        id: i++,
        name: city,
        stars: stars,
        visited: visited
    };
    clearInputs();
    return dataObj;
};

var drawTable = function () {
    $("#the-table tbody").html('');
    store.getAll().then(function (data) {
        if (data.length > 0) {
            $("tfoot").attr("class","hide");
            populate(data);
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
                stele = stele + "&#9734;";
            }
            $("#the-table tbody").append(tmpl("tpl", {
                city: element.name,
                stars: stele,
                visited: element.visited,
                id: element.id
            }));
        });
        attachEvents(data);
    };
};

var attachEvents = function (data) {
    $(".remove").confirm( {
        message: "Are you sure?",
        onConfirm: function () {
        var id = $(this).closest("tr").data("id");
        store.delete(id);
        clearInputs();
        drawTable();
        },
        onReject: function (){

        }
    });

    $(".edit").on("click", function () {
        var id = $(this).closest("tr").data("id");
        $("#checkEdit").val(id);
        $("#cancel").attr("type", "button");

        $.each(data, function (index, element) {
            if (element.id == id) {
                $("#city").val(element.name);
                $("#result").val(element.stars).change();

                if (element.visited == 1) {
                    $("#checkbox").prop('checked', true);
                }
                else {
                    $("#checkbox").prop('checked', false);
                }
            }
        });
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