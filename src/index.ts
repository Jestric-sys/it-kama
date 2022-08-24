import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel';
import { CourseViewModel } from './models/CourseViewModel';
import { GetCoursesQueryModel } from './models/GetCoursesQueryModel';
import { CourseUpdateModel } from './models/CourseUpdateModel';
import { CourseCreateModel } from './models/CourseCreateModel';
import { RequestWithQuery, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from './types';
import express, { Request, Response } from 'express';

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

type CourseType = {
    id: number,
    title: string,
    studentsCount: number
};

const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 15},
        {id: 3, title: 'automation qa', studentsCount: 7},
        {id: 4, title: 'devops', studentsCount: 8}
    ]
};

app.get('/', (req: Request, res: Response<string>) => {
    res.json('hello express');
});

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    };
};

app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModel>, res: Response<CourseViewModel[]>) => {
    let foundCourses: CourseType[] = db.courses;

    if (req.query.title) {
        foundCourses = foundCourses.filter((c: any) => c.title.indexOf(req.query.title) > -1);
    };

    res.json(foundCourses.map(getCourseViewModel));
});

app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
    const foundCourse: any = db.courses.find((c: any) => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
        return;
    };

    res.json(getCourseViewModel(foundCourse));
});

app.post('/course', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
        return;
    };

    const course: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    };
    db.courses.push(course);
    res.status(HTTP_STATUS.CREATED_201).json(getCourseViewModel(course));
});

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    db.courses = db.courses.filter((c: any) => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>, res: Response) => {

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

app.delete('/__test__/data', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
});

app.listen(port, host, () => {
    console.log(`http://${host}:${port}`);
});