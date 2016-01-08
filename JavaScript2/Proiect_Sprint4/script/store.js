var store = (function () {
    // private
    var data = [
        {
            id: 1,
            name: 'Bucharest',
            stars: 3,
            visited: true
        },
        {
            id: 2,
            name: 'Amsterdam',
            stars: 4,
            visited: false
        },
        {
            id: 3,
            name: 'Paris',
            stars: 5,
            visited: true
        },
    ];

    //public
    return {
        getAll: function () {
            return new Promise(function (resolve, reject) {
               //resolve data va fi in call ajax...va da eroare deoarece returneaza obiect nu array
                resolve(data);
            });
        },
        add: function (item) {
            return new Promise(function (resolve, reject) {
                data.push(item);
                resolve(data);
            });
        },
        update: function (id, updateData) {
            return new Promise(function (resolve, reject) {
                $.each(data, function (index) {
                    if (this.id == id) {
                        data[index] = updateData;
                        resolve(data);
                    }
                });
            });
        },
        delete: function (id) {
            return new Promise(function (resolve, reject) {
                $.each(data, function (index) {
                    if (this.id == id) {
                        data.splice(index, 1);
                        resolve(data);
                    }
                });
            });
        }
    };
})();

var citiesUrl = "http://server.godev.ro:8080/api/razvan/entries";
var dataJSON;
var head = {
    'Content-Type': 'application/json'
};

var getSettings = {
    type: 'GET',
    headers: head,
    data: dataJSON
};

var postSettings = {
    type: 'POST',
    headers: head,
    data: dataJSON
};

var putSettings = {
    type: 'PUT',
    headers: head,
    data: dataJSON
};

var deleteSettings = {
    type: 'DELETE',
    headers: head,
    data: dataJSON
};