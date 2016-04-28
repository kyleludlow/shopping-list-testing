var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Storage = function () {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function (name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};


Storage.prototype.delete = function (id) {
    for (var arrayIndex in this.items) {

        if (id === this.items[arrayIndex].id) {
            this.items.splice(arrayIndex, 1);
            return true;
        }
    }
};
Storage.prototype.modify = function (newObject) {
    for (var arrayIndex in this.items) {
        if (newObject.id === this.items[arrayIndex].id) {
            this.items[arrayIndex] = newObject;
            return true;
        }
    }
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');


var app = express();

app.use(express.static('public'));

app.get('/items', function (req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function (req, res) {

    var itemId = parseInt(req.params.id, 10);

    if (!storage.delete(itemId)) {
        return res.sendStatus(400);
    } else {
        res.status(201).json(storage.items);
    }
});

app.put('/items/:id', jsonParser, function (req, res) {
    if (!storage.modify(req.body)) {
        return res.sendStatus(400);
    } else {
        res.status(201).json(storage.items);
    }

});


exports.app = app;
exports.storage = storage;

app.listen(process.env.PORT || 8080);


