import express from 'express';

const host: string = '127.0.0.10';
const port: number = 3000;

export const app: any = express();

app.use(express.json());

export const HTTP_STATUS: any = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};

const db: any = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'automation qa'},
        {id: 4, title: 'devops'}
    ]
};

app.get('/', (req: any, res: any) => {
    res.json('hello express');
});

app.get('/courses', (req: any, res: any) => {
    let foundCourses: any = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses.filter((c: any) => c.title.indexOf(req.query.title) > -1);
    };

    res.json(foundCourses);
});

app.get('/courses/:id', (req: any, res: any) => {
    const foundCourses: any = db.courses.find((c: any) => c.id === +req.params.id);

    if (!foundCourses) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    };

    res.json(foundCourses);
});

app.post('/course', (req: any, res: any) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    };

    const course: any = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(course);
    res.status(HTTP_STATUS.CREATED_201).json(course);
});

app.delete('/courses/:id', (req: any, res: any) => {
    db.courses = db.courses.filter((c: any) => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.put('/courses/:id', (req: any, res: any) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    };

    const foundCourses: any = db.courses.find((c: any) => c.id === +req.params.id);

    if (!foundCourses) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    };

    foundCourses.title = req.body.title;

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.delete('/__test__/data', (req: any, res: any) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.listen(port, host, () => {
    console.log(`http://${host}:${port}`);
});