var $loader = $(".loader");

var showLoader = function () {
    $loader.attr("class","loader");
};

var hideLoader = function () {
    $loader.attr("class","hide");
}

var store = (function () {
    // private
    var data = [];

    //public
    return {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                $.ajax(citiesUrl, getSettings).done(function (data) {
                    resolve(data.list);
                });
            });
        },
        add: function (item) {
            return new Promise(function (resolve, reject) {
                var dataJSON = JSON.stringify(item);
                $.ajax(citiesUrl,{
                    type: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: dataJSON,
                    beforeSend: showLoader(),
                    complete: hideLoader()
                }).done(function () {
                    $.ajax(citiesUrl).done(function (data) {
                        resolve(data);
                    });
                });
            });
        },
        update: function (id, updateData) {
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl+"/"+id;
                var dataJSON = JSON.stringify(updateData);
                $.ajax(newUrl,{
                    type: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: dataJSON,
                    beforeSend: showLoader(),
                    complete: hideLoader()
                }).done(function (data) {
                    resolve(data);
                });
            });
        },
        delete: function (id) {
            return new Promise(function (resolve, reject) {
                var newUrl = citiesUrl+"/"+id;
                $.ajax(newUrl, deleteSettings).done(function (data) {
                    resolve(data);
                });
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
    headers: head,
    beforeSend: showLoader(),
    complete: showLoader()
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
    headers: head,
    beforeSend: showLoader(),
    complete: hideLoader()
};
