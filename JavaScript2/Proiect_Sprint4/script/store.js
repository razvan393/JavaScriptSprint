var $loader = $(".loader");
var $inputs = $("input");
var $city = $("#city");
var $result = $("#result");
var $checkbox = $("#checkbox");
var $page = $("#page");
var currentPage = parseInt($page.text());

var showLoader = function () {
    $loader.attr("class","loader");
    $inputs.prop("readonly", true);
};

var hideLoader = function () {
    $loader.attr("class","hide");
    $inputs.prop("readonly", false);
}

var store = (function () {
    // private
    var data = [];

    //public
    return {
        getAll: function (id) {
            showLoader();
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl + "?page="+id;
                $.ajax(newUrl, getSettings).done(function (data) {
                    resolve(data);
                }).fail(function (xhr) {
                    alert(xhr.status);
                });
                hideLoader();
            });
        },
        get: function (id){
            showLoader();
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl + "/"+ id;
                $.ajax(newUrl, getSettings).done(function (data) {
                    resolve(data);
                    $city.val(data.name);
                    $result.val(data.stars).change();

                    if (data.visited == 1) {
                        $checkbox.prop('checked', true);
                    }
                    else {
                        $checkbox.prop('checked', false);
                    }
                }).fail(function (xhr) {
                    alert(xhr.status);
                });
                hideLoader();
            });
        },
        add: function (item) {
            showLoader();
            return new Promise(function (resolve, reject) {
                var dataJSON = JSON.stringify(item);
                $.ajax(citiesUrl,{
                    type: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: dataJSON
                }).done(function () {
                    currentPage = parseInt($page.text());
                    $.ajax(citiesUrl).done(function (data) {
                        resolve(data);
                        drawTable(currentPage);
                    }).fail(function (xhr) {
                        alert(xhr.status);
                    });
                });
                hideLoader();
            });
        },
        update: function (id, updateData) {
            showLoader();
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl+"/"+id;
                var dataJSON = JSON.stringify(updateData);
                $.ajax(newUrl,{
                    type: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: dataJSON
                }).done(function (data) {
                    currentPage = parseInt($page.text());
                    resolve(data);
                    drawTable(currentPage);
                }).fail(function (xhr) {
                    alert(xhr.status);
                });
                hideLoader();
            });
        },
        delete: function (id) {
            showLoader();
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl+"/"+id;
                $.ajax(newUrl, deleteSettings).done(function (data) {
                    currentPage = parseInt($page.text());
                    resolve(data);
                    drawTable(currentPage);
                }).fail(function (xhr) {
                    alert(xhr.status);
                });
                hideLoader();
            });
        }
    };
})();
var citiesUrl = "http://server.godev.ro:8080/api/razvan/entries";
var head = {
    'Content-Type': 'application/json'
};

var getSettings = {
    type: 'GET',
    headers: head
}

/*
 var postSettings = {
 type: 'POST',
 headers: head,
 data: dataJSON
 };

 var putSettings = {
 type: 'PUT',
 headers: head,
 data: dataJSON
 };*/

var deleteSettings = {
    type: 'DELETE',
    headers: head
};
