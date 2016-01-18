var store = (function () {

    var apiUrl = "http://server.godev.ro:8080/api/razvan/entries";
    var headers = {
        'Content-Type': 'application/json'
    };

    var errorHandler = function(reject) {
        return function (xhr) {
            if(xhr.status === 409) {
                reject(xhr.responseJSON.error);
            } else {
                reject('An unknown error occurred');
            }
        };
    };

    return {
        getAll: function (page, field, order) {
            return new Promise(function (resolve, reject) {
                $.ajax(apiUrl + "?page=" + page + "&sortField=" + field + "&sortDir=" + order, {
                    type: 'GET',
                    headers: headers
                }).done(resolve).fail(errorHandler(reject));
            });
        },
        get: function (id){
            return new Promise(function (resolve, reject) {
                $.ajax(apiUrl + "/"+ id, {
                    type: 'GET',
                    headers: headers
                }).done(resolve).fail(errorHandler(reject));
            });
        },
        add: function (item) {
            return new Promise(function (resolve, reject) {
                $.ajax(apiUrl, {
                    type: 'POST',
                    headers: headers,
                    data: JSON.stringify(item)
                }).done(resolve).fail(errorHandler(reject));
            });
        },
        update: function (id, updateData) {
            return new Promise(function (resolve, reject) {
                $.ajax(apiUrl + "/" + id, {
                    type: 'PUT',
                    headers: headers,
                    data: JSON.stringify(updateData)
                }).done(resolve).fail(errorHandler(reject));
            });
        },
        delete: function (id) {
            return new Promise(function (resolve, reject) {
                $.ajax(apiUrl + "/" + id, {
                    type: 'DELETE',
                    headers: headers
                }).done(resolve).fail(errorHandler(reject));
            });
        }
    };
})();