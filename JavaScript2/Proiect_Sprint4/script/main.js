$(document).ready(function () {
    drawTable();
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
};

var getFormData = function () {
    var city = $("[name=city]").val();
    var visited = $("[name=checkbox]").is(":checked");
    var dataObj = {
        id: i++,
        name: city,
        stars: 3,
        visited: visited
    };
    clearInputs();
    return dataObj;
};

var drawTable = function () {
    $("#the-table tbody").html('');
    store.getAll().then(function (data) {
        populate(data);
    });

    var populate = function (data) {
        $.each(data, function (index, element) {
            $("#the-table tbody").append(tmpl("tpl", {
                city: element.name,
                stars: element.stars,
                visited: element.visited,
                id: element.id
            }));
        });
        attachEvents(data);
    };
};

var attachEvents = function (data) {
    $(".remove").on("click", function () {
        var id = $(this).closest("tr").data("id");
        console.log(id);
        store.delete(id);
        clearInputs();
        drawTable();
    });

    $(".edit").on("click", function () {
        var id = $(this).closest("tr").data("id");
        $("#checkEdit").val(id);
        $("#cancel").attr("type", "button");
        $.each(data, function (index, element) {
            if (element.id == id) {
                $("#city").val(element.name);
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
    $("#result").val(0);
};