var theTable = document.getElementById("the-table");
var tableBody = theTable.getElementsByTagName("tbody")[0];
var addBtn = document.getElementById("add");
var myForm = document.getElementById("myForm");
var filterName = document.getElementById("filter-name");
var filterCity = document.getElementById("filter-city");
var filterWeekend = document.getElementById("filter-weekend");
var rate = document.getElementById("rate");
var storage = [];
var map;
var thName = document.getElementById("h-name");
var thOras = document.getElementById("h-oras");
var thRating = document.getElementById("h-rating");
var latlong = [];
var filtruOk, filtruNume, filtruOras;
var starNumber = 0;
var globalMarkers = [];
var id = 0;
var rowId = document.getElementById("rowId");
var checkboxWeekend = document.getElementById("checkbox");
var starRating = document.getElementById("result");
var j = 0;
var mark;
var alphaExp = /^[a-zA-Z]+$/;
var eroareName;
var eroareOras;
var eroareRating;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.40, lng: 26.10},
        zoom: 8
    });
}

function numberStars (a, text)
{
    for(var i =1; i<=a; i++)
    {
        document.getElementById(i).innerHTML = text;
    }
}

var isAddBtn = function (target) {
    return target.classList.contains("add-btn");
};

var isRemoveBtn = function (target) {
    return target.classList.contains("remove");
};

var createRow = function (x) {
    var tr = document.createElement("tr");
    tr.innerHTML = tmpl("tpl", {name:x.name, oras:x.oras, rating: x.rating, id: x.id});
    reloadMarker(x.position.lat, x.position.long);
    tableBody.appendChild(tr);
};

var getInputs = function(form){
    return form.getElementsByTagName("input");
};

var isValidLength = function (name) {
    return name.length > 2;
};

var isValidName = function (name) {
    return name.match(alphaExp);
};

var isValidRating = function (rating) {
    return (rating > 0);
};

var checkForErrors = function (name, oras, rating) {
    if (!name.match(alphaExp))
    {
        eroareName = "Introduce-ti un nume valid!"
    }
    if (oras.length < 2)
    {
        eroareOras = "Intruduce-ti un oras!";
    }
    if (rating == 0)
    {
        eroareRating = "Introduce-ti rating!";
    }
};

var isValid = function (name, oras, rating) {
    eroareName = eroareOras = eroareRating = "";
    checkForErrors(name, oras, rating);
    if( isValidName(name) && isValidLength(oras) && isValidRating(rating))
    {
        return true;
    }
    else
    {
        return false;
    }
};

var calculateAvgRating = function (store) {
    var sum = 0;
    if(store.length>0) {
        for (var i = 0; i < store.length; i++) {
            sum += parseInt(store[i].rating, 10);
        }
        return sum / store.length;
    }
    else
    {
        return 0;
    }
};

var recalculateTotal = function (store) {
    var totalReg = document.getElementById("total");
    var avgRating = document.getElementById("avg-rating");
    totalReg.innerHTML = store.length;
    avgRating.innerHTML = parseFloat(calculateAvgRating(store)).toFixed(1);
};

var reloadTable = function (store) {
    tableBody.innerHTML = "";
    for(var i=0; i<store.length; i++)
    {
        createRow(store[i]);
    }
    recalculateTotal(store);
};

var clearInputs = function () {
    document.getElementById("nume").value = "";
    document.getElementById("oras").value = "";
    document.getElementById("result").value = "0";
    numberStars(5,"&#9734");
    starNumber = 0;
    document.getElementById("checkbox").checked = false;
    document.getElementById("eroare-nume").innerHTML = "";
    document.getElementById("eroare-nume").classList.add("hide");
    document.getElementById("eroare-oras").innerHTML = "";
    document.getElementById("eroare-oras").classList.add("hide");
    document.getElementById("eroare-rating").innerHTML = "";
    document.getElementById("eroare-rating").classList.add("hide");
};

var clearErrors = function () {
    document.getElementById("eroare-nume").innerHTML = "";
    document.getElementById("eroare-nume").classList.add("hide");
    document.getElementById("eroare-oras").innerHTML = "";
    document.getElementById("eroare-oras").classList.add("hide");
    document.getElementById("eroare-rating").innerHTML = "";
    document.getElementById("eroare-rating").classList.add("hide");
};

var getFather = function (x) {
    return x.parentNode;
};

var getPos = function (x, y) {
    var pos=0;
    for (var i=0; i< y.length; i++)
    {
        if(x === y[i] )
        {
            pos = i;
        }
    }
    return pos;
};

var removeLineStorage = function (x) {
    storage.splice(x,1);
};

var checkBox = function (chk) {
    return(chk.checked)
};

var getValues = function (form) {
    var inputs = form.getElementsByTagName("input");
    var name = inputs[0].value;
    var oras = inputs[1].value;
    var rating = parseInt(inputs[2].value,10);
    var weekend = checkBox(inputs[4]);
    var currentId = rowId.value;
    if (isValid(name, oras, rating))
    {
        if(currentId == '')
        {
            createMarker(name, oras, rating, weekend);
        }
        else
        {
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode ({'address':oras}, function (results, status){
                        if (status == google.maps.GeocoderStatus.OK)
                        {
                            map.setCenter(results[0].geometry.location);
                            mark = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location
                            });
                            for (j = 0; j < storage.length; j++)
                            {
                                if(storage[j].id == currentId)
                                {
                                    storage[j].name = name;
                                    storage[j].oras = oras;
                                    storage[j].rating = rating;
                                    storage[j].weekend = weekend;
                                    storage[j].position.lat = mark.position.lat();
                                    storage[j].position.long = mark.position.lng();
                                }
                            }
                        }
                        reloadTable(getFilteredStorage(storage));
                        clearInputs();

                    });

            globalMarkers = [];
            for (var i = 0 ; i <storage.length; i++)
            {
                var myLatlng = new google.maps.LatLng(storage[i].position.lat,storage[i].position.long);
                var marker = new google.maps.Marker({
                    position: myLatlng
                });
                globalMarkers.push(marker);
            }
            clearMarkers();
            if (storage.length > 0) {
                centerMap(storage[storage.length-1].position.lat, storage[storage.length-1].position.long);
            }
            rowId.value = "";
        }
    }
    else
    {
        if (eroareName != "")
        {
            document.getElementById("eroare-nume").innerHTML = eroareName;
            document.getElementById("eroare-nume").classList.remove("hide");
        }
        if (eroareOras != "")
        {
            document.getElementById("eroare-oras").innerHTML = eroareOras;
            document.getElementById("eroare-oras").classList.remove("hide");
        }
        if (eroareRating != "")
        {
            document.getElementById("eroare-rating").innerHTML = eroareRating;
            document.getElementById("eroare-rating").classList.remove("hide");
        }
    }

};

var centerMap = function (lat, long) {
    map.setZoom(8);
    map.setCenter(new google.maps.LatLng(lat, long));
};

var reloadMarker = function (lat, long) {
    var myLatlng = new google.maps.LatLng(lat,long);
    var marker = new google.maps.Marker({
        position: myLatlng
    });
    marker.setMap(map);
};

var createMarker  = function (name, address, rating, weekend) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode ({'address':address}, function (results, status){
        if (status == google.maps.GeocoderStatus.OK)
        {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            globalMarkers.push(marker);
            latlong[0] = marker.position.lat();
            latlong[1] = marker.position.lng();
            var position = {
                lat: latlong[0],
                long: latlong[1]
            };

                var obiect = {
                    id: getId(),
                    name: name,
                    oras: address,
                    rating: rating,
                    position: position,
                    weekend: weekend
                };
                storage.push(obiect);
                reloadTable(getFilteredStorage(storage));
                centerMap(storage[storage.length-1].position.lat, storage[storage.length-1].position.long);
                clearInputs();

        }
        else
        {
            eroareOras = "Nu exista acest oras!";
            if (eroareName != "")
            {
                document.getElementById("eroare-nume").innerHTML = eroareName;
                document.getElementById("eroare-nume").classList.remove("hide");
            }
            if (eroareOras != "")
            {
                document.getElementById("eroare-oras").innerHTML = eroareOras;
                document.getElementById("eroare-oras").classList.remove("hide");
            }
            if (eroareRating != "")
            {
                document.getElementById("eroare-rating").innerHTML = eroareRating;
                document.getElementById("eroare-rating").classList.remove("hide");
            }
        }
    });
};

var startsWith = function (sir, prefix) {
    return sir.indexOf(prefix) === 0;
};

var sort_by = function(field, reverse, primer){
    var key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};

var filtName = function (item) {
    return startsWith(item.name, filtruNume) ;
};

var getFilteredByName = function (store) {
    if(isDefined(filtruNume))
    {
        return store.filter(filtName);
    }
    return store;
};

var filtCity = function (item) {
    return  startsWith(item.oras, filtruOras);
};

var getFilteredByCity = function (store) {
    if(isDefined(filtruOras))
    {
        return store.filter(filtCity);
    }
    return store;
};

var filterWk = function (item) {
    return item.weekend === filtruOk;
};

var getFilteredByWk = function (store) {
    if(isDefined(filtruOk) && (filtruOk === true))
    {
        return store.filter(filterWk)
    }
    return store;
};

var isDefined = function (filtru) {
    return (filtru != null)
};

var getFilteredStorage = function (store) {
    var filteredStorage = getFilteredByWk(getFilteredByCity(getFilteredByName(store)));
    globalMarkers = [];
    for (var i = 0 ; i <filteredStorage.length; i++)
    {
        var myLatlng = new google.maps.LatLng(filteredStorage[i].position.lat,filteredStorage[i].position.long);
        var marker = new google.maps.Marker({
            position: myLatlng
        });
        globalMarkers.push(marker);
    }
    clearMarkers();
    if (filteredStorage.length > 0) {
        centerMap(filteredStorage[filteredStorage.length-1].position.lat, filteredStorage[filteredStorage.length-1].position.long);
    }
    return filteredStorage;
};

var clearMarkers = function () {

    initMap();
    for (var i = 0; i < globalMarkers.length; i++ )
    {
        reloadMarker(globalMarkers[i].position.lat(),globalMarkers[i].position.lng());
    }
};

var getId = function () {
    return id++;
};

var isEditBtn = function (target) {
    return target.classList.contains("edit");
};


var editRow = function (target) {
    var id = getIdOfButton(target);
    var data = getDataFromStore (storage, id);
    populateForm(data);
};

var getDataFromStore = function (storage, id) {
    for (var i = 0; i< storage.length; i++)
    {
        if(storage[i].id == id)
        {
            return storage[i];
        }
    }
};

var getIdOfButton = function (target) {
    return parseInt(target.getAttribute('data-id'));
};

var populateForm = function (data) {
    var nume = myForm.children[1];
    var oras = myForm.children[3];
    nume.value = data.name;
    oras.value = data.oras;
    numberStars (5, "&#9734");
    numberStars (data.rating, "&#9733");
    rowId.value = data.id;
    starRating.value = data.rating;
    if (data.weekend)
    {
        checkboxWeekend.checked = true;
    }
};

tableBody.addEventListener("click", function () {
    if (isRemoveBtn(event.target))
    {
        event.preventDefault();
        var grandpa = getFather(getFather(event.target));
        var grandpaSiblings = grandpa.parentNode.children;
        var grandpaPos = getPos(grandpa, grandpaSiblings);
        removeLineStorage(grandpaPos);
        initMap();
        reloadTable(storage);
        centerMap(storage[storage.length-1].position.lat, storage[storage.length-1].position.long);
    }
    else if (isEditBtn(event.target))
    {
        event.preventDefault();
        editRow(event.target);
    }
    else
    {
        var father = getFather(getFather(event.target));
        var fatherSiblings = father.parentNode.children;
        var fatherPos = getPos(father, fatherSiblings);
        centerMap(storage[fatherPos].position.lat, storage[fatherPos].position.long);
    }
});

addBtn.addEventListener("click", function () {
    if (isAddBtn(event.target))
    {
        event.preventDefault();
        clearErrors();
        getValues(myForm);
    }
});
thName.addEventListener("click", function () {
    storage.sort(sort_by("name", false, function(a){return a.toUpperCase()}));
    reloadTable(getFilteredStorage(storage));
});

thName.addEventListener("dblclick", function () {
    storage.sort(sort_by("name", false, function(a){return a.toUpperCase()}));
    storage.reverse();
    reloadTable(getFilteredStorage(storage));
});

thOras.addEventListener("click", function () {
    storage.sort(sort_by("oras", false, function(a){return a.toUpperCase()}));
    reloadTable(getFilteredStorage(storage));
});

thOras.addEventListener("dblclick", function () {
    storage.sort(sort_by("oras", false, function(a){return a.toUpperCase()}));
    storage.reverse();
    reloadTable(getFilteredStorage(storage));
});

thRating.addEventListener("click", function () {
    storage.sort(sort_by("rating", false, parseInt));
    reloadTable(getFilteredStorage(storage));
});

thRating.addEventListener("dblclick", function () {
    storage.sort(sort_by("rating", false, parseInt));
    storage.reverse();
    reloadTable(getFilteredStorage(storage));
});

rate.addEventListener("click", function ( event ) {
    var id = parseInt(event.target.id, 10);
    if ((id >0 ) && (id<6))
    {
        numberStars(5,"&#9734");
        document.getElementById("result").value = id;
        var v = starNumber = id.toString();
        numberStars (v, "&#9733");
    }
});

rate.addEventListener("mouseover", function ( event ) {
    var id = parseInt(event.target.id, 10);
    if ((id >0 ) && (id<6))
    {
        var v = id.toString();
        numberStars (v, "&#9733");
    }
});

rate.addEventListener("mouseout", function ( event ) {
    numberStars (5, "&#9734");
    numberStars (starNumber, "&#9733");
});

filterName.addEventListener("input", function () {
    filtruNume = filterName.value;

    if (isDefined(filtruNume) || isDefined(filtruOras) || isDefined(filtruOk))
    {
        reloadTable(getFilteredStorage(storage));
    }
    else
    {
        reloadTable(storage);
    }
});

filterCity.addEventListener("input", function () {
    filtruOras = filterCity.value;
    if (isDefined(filtruNume) || isDefined(filtruOras) || isDefined(filtruOk))
    {
        reloadTable(getFilteredStorage(storage));
    }
    else
    {
        reloadTable(storage);
    }
});

filterWeekend.addEventListener("change", function () {
    filtruOk = checkBox(filterWeekend);
    if (isDefined(filtruNume) || isDefined(filtruOras) || isDefined(filtruOk))
    {
        reloadTable(getFilteredStorage(storage));
    }
    else
    {
        reloadTable(storage);
    }
});
