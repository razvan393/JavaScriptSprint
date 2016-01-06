$(document).ready(function () {
    reloadStore();
    $("#stars").on("click", function (event) {
        numberStars(5, "☆");
        var starId = +event.target.id;
        console.log(event.target.id);
        if(!isNaN(starId)) {
            $("#result").text(starId);
        }
        else {
            $("#result").text(0);
        }
        numberStars(starId, '★');
    });

    $('#myForm').submit(function() {
        console.log($(this).serialize());
        return false;
    });

    $(".remove").on("click", function () {
        var id = $(this).data("id");
        store.delete(id);
        reloadStore();
    });

    $(".edit").on("click", function () {
        var id = $(this).data("id");
        var localData = store.getAll();
        $.each(localData, function (index, element) {
            console.log(localData);
            if(element.id == id)
            {
                $("#city").text(element.name);
                $("#checkEdit").text(1);
                numberStars(element.stars, '★' );
                $("#result").text(element.stars);
                if(element.visited == "yes") {
                    $("#checkbox").attr('checked', true);
                }
                console.log(element.visited);
            }
        });
    });
});

var store = (function() {
    // private
    var data = [
        {
            id: 1,
            name: 'Bucharest',
            stars: 3,
            visited: 'yes'
        },
        {
            id: 2,
            name: 'Amsterdam',
            stars: 4,
            visited: 'no'
        },
        {
            id: 3,
            name: 'Paris',
            stars: 5,
            visited: 'yes'
        },
    ];

    //public
    return {
        getAll: function() {
            return data;
        },
        add: function(item) {
            return new Promise(function(resolve, reject) {
                data.push(item);
                resolve(data);
            });
        },
        update: function(id, updateData) {
            return new Promise(function(resolve, reject) {
                $.each(data, function(index) {
                    if (this.id == id) {
                        data[index] = updateData;
                        resolve(data);
                    }
                });
            });
        },
        delete: function(id) {
            return new Promise(function(resolve, reject) {
                $.each(data, function(index) {
                    if (this.id == id) {
                        data.splice(index, 1);
                        resolve(data);
                    }
                });
            });
        }
    };
})();

var reloadStore = function () {
    $("#the-table tbody").html('');
    var localData = store.getAll();
    $.each(localData, function (index, element) {
        $("#the-table tbody").append(tmpl("tpl", {city:element.name, stars:element.stars, visited:element.visited, id: element.id}));
    });
}

var numberStars = function (number, text) {
    for(var i=1; i<=number; i++) {
        $("#" + i + "").text(text);
    }
}

var clearInputs = function () {
    $("#city").text('');
    numberStars(5, "☆");
    $("#checkbox").attr('checked', false);
    $("#result").text(0);
}