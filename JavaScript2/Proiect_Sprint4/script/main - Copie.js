$(document).ready(function () {
    drawTable();
    onSubmit();
});

var i = 3;

var onSubmit = function () {
    $('#myForm').submit(function () {
        var city = $("[name=city]").val();
        var visited = $("[name=checkbox]").is(":checked") ? 1 : 0;
        var dataObj = {
            id: i++,
            name: city,
            stars: 3,
            visited: visited
        };
        var checkEdit = $("#checkEdit").val();

        if (checkEdit > 0) {
            store.update(checkEdit, dataObj);
            drawTable();
        }
        else {
            store.add(dataObj);
            drawTable();
        }
        clearInputs();
        return false;
    });
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
    })
        $(".remove").on("click", function () {
            var id = $(this).data("id");
            store.delete(id);
            clearInputs();
            drawTable();
        });

        $(".edit").on("click", function () {
            var id = $(this).data("id");
            $("#checkEdit").val(id);
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

};

var clearInputs = function () {
    $("#city").val('');
    $("#checkbox").attr('checked', false);
    $("#result").val(0);
    $("#checkEdit").val(0);
};

