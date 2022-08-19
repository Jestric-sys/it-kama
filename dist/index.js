"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var host = '127.0.0.10';
var port = 3000;
var app = (0, express_1.default)();
app.use(express_1.default.json());
var HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
var db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'automation qa' },
        { id: 4, title: 'devops' }
    ]
};
app.get('/', function (req, res) {
    res.json('hello express');
});
app.get('/courses', function (req, res) {
    var foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter(function (c) { return c.title.indexOf(req.query.title) > -1; });
    }
    ;
    res.json(foundCourses);
});
app.get('/courses/:id', function (req, res) {
    var foundCourses = db.courses.find(function (c) { return c.id === +req.params.id; });
    if (!foundCourses) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    ;
    res.json(foundCourses);
});
app.post('/course', function (req, res) {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    ;
    var course = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(course);
    res.status(HTTP_STATUS.CREATED_201).json(course);
});
app.delete('/courses/:id', function (req, res) {
    db.courses = db.courses.filter(function (c) { return c.id !== +req.params.id; });
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
app.put('/courses/:id', function (req, res) {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    }
    ;
    var foundCourses = db.courses.find(function (c) { return c.id === +req.params.id; });
    if (!foundCourses) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    }
    ;
    foundCourses.title = req.body.title;
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});
app.listen(port, host, function () {
    console.log("http://".concat(host, ":").concat(port));
});
