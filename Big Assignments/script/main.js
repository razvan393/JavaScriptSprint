var theTable = document.getElementById("the-table");
var tableBody = theTable.getElementsByTagName("tbody")[0];
var addBtn = document.getElementById("add");
var myForm = document.getElementById("myForm");
var rate = document.getElementById("rate");
var storage = [];
var map;
var geocoder;
var thName = document.getElementById("h-name");
var thOras = document.getElementById("h-oras");
var thRating = document.getElementById("h-rating");

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 44.40, lng: 26.10},
        zoom: 8
    });
}

rate.addEventListener("click", function ( event ) {
    var id = parseInt(event.target.id, 10);
    if ((id >0 ) && (id<6))
    {
        numberStars(5,"&#9734");
        document.getElementById("result").value = id;
        var v = id.toString();
        numberStars (v, "&#9733");
    }
}, false);

function numberStars (a, text)
{
    for(var i =1; i<=a; i++)
    {
        document.getElementById(i).innerHTML = text;
    }
}

var isAddBtn = function (target) {
    return target.classList.contains("add-btn");
}

var isRemoveBtn = function (target) {
    return target.classList.contains("remove");
}

var createRow = function (x) {
    var tr = document.createElement("tr");
    tr.innerHTML = tmpl("tpl", x);
    tableBody.appendChild(tr);
};

var getInputs = function(form){
    return form.getElementsByTagName("input");
}

var getValues = function (form) {
    var inputs = form.getElementsByTagName("input");
    var name = inputs[0].value;
    var oras = inputs[1].value;
    var rating = parseInt(inputs[2].value,10);
    var marker = createMarker(oras);
    return {
        name: name,
        oras: oras,
        rating: rating,
        position: marker
    };
};

var isValidName = function (name) {
    return name.length > 2;
}

var isValid = function () {
    var values = getValues(myForm);
    if (isValidName(values.name) && isValidCity(values.oras))
    {
        return true;
    }
    else
    {
        return false;
    }
}

var calculateAvgRating = function () {
    var sum = 0;
    if(storage.length>0) {
        for (var i = 0; i < storage.length; i++) {
            sum += parseInt(storage[i].rating, 10);
        }
        return sum / storage.length;
    }
    else
    {
        return 0;
    }
};

var recalculateTotal = function () {
    var totalReg = document.getElementById("total");
    var avgRating = document.getElementById("avg-rating");
    totalReg.innerHTML = storage.length;
    avgRating.innerHTML = parseFloat(calculateAvgRating()).toFixed(1);
};

var reloadTable = function () {
    tableBody.innerHTML = "";
    for(var i=0; i<storage.length; i++)
    {
        createRow(storage[i]);
        reloadMarker(storage[i].position);
    }
};

var clearInputs = function () {
    document.getElementById("nume").value = "";
    document.getElementById("oras").value = "";
    document.getElementById("result").value = "0";
    numberStars(5,"&#9734");
    document.getElementById("checkbox").checked = false;
};

var getFather = function (x) {
    return x.parentNode;
};

var getPosition = function (x, y) {
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

var isValidCity = function (address) {
    if(address.length > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var createMarker  = function (address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode ({'address':address}, function (results, status){
        if (status == google.maps.GeocoderStatus.OK)
        {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            console.log(typeof marker.position);
            return results[0].geometry.location;
        }
        else
        {
            console.log("Geocode was not successful for the following reason: " + status);
            alert("Orasul nu exista!");
            return 0;
        }
    });
};

var centerMap = function (address) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address':address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
          map.setCenter(results[0].geometry.location);
        }
    });
};

var reloadMarker = function (pos) {
    var marker = new google.maps.Marker({
        map: map,
        position: pos
    });
};

var sort_by = function(field, reverse, primer){

    var key = primer ?
        function(x) {return primer(x[field])} :
        function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

addBtn.addEventListener("click", function () {
    if (isAddBtn(event.target))
    {
        event.preventDefault();
        if(isValid())
        {
            storage.push(getValues(myForm));
            recalculateTotal();
            clearInputs();
        }
        reloadTable();
    }
});

tableBody.addEventListener("click", function () {
    if (isRemoveBtn(event.target))
    {
        event.preventDefault();
        var grandpa = getFather(getFather(event.target));
        var grandpaSiblings = grandpa.parentNode.children;
        var grandpaPos = getPosition(grandpa, grandpaSiblings);
        removeLineStorage(grandpaPos);
        initMap();
        recalculateTotal();
        reloadTable();
    }
    else
    {
        var father = getFather(getFather(event.target));
        var fatherSiblings = father.parentNode.children;
        var fatherPos = getPosition(father, fatherSiblings);
        centerMap(storage[fatherPos].oras);
    }
});

thName.addEventListener("click", function () {
    storage.sort(sort_by("name", false, function(a){return a.toUpperCase()}));
    reloadTable();
});

thOras.addEventListener("click", function () {
    storage.sort(sort_by("oras", false, function(a){return a.toUpperCase()}));
    reloadTable();
});

thRating.addEventListener("click", function () {
    storage.sort(sort_by("rating", false, parseInt));
    reloadTable();
});