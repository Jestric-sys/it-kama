import { CourseUpdateModel } from './../../src/models/CourseUpdateModel';
import { CourseCreateModel } from './../../src/models/CourseCreateModel';
import request from 'supertest';
import { app, HTTP_STATUS } from '../../src';

describe('/course', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data');
    });

    it ('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, []);
    });

    it ('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/999999')
            .expect(HTTP_STATUS.NOT_FOUND_404);
    });

    it ('should\'nt create course with correct input data', async () => {
        const data: CourseCreateModel = { title: '' };
        await request(app)
            .post('/course')
            .send(data)
            .expect(HTTP_STATUS.BAD_REQUEST_400);
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, []);
    });

    let createdCourse: any = null;
    it ('should create course with correct input data', async () => {
        const data: CourseCreateModel = { title: 'dba' };
        const createResponse: any = await request(app)
            .post('/course')
            .send(data)
            .expect(HTTP_STATUS.CREATED_201);

        createdCourse = createResponse.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: data.title
        });

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createdCourse]);
    });

    it ('should\'nt update course with correct input data', async () => {
        const data: CourseUpdateModel = { title: '' };
        await request(app)
            .put(`/courses/${createdCourse.id}`)
            .send(data)
            .expect(HTTP_STATUS.BAD_REQUEST_400);

        await request(app)
            .get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUS.OK_200, createdCourse);
    });

    it ('should\'nt update course that not exist', async () => {
        const data: CourseUpdateModel = { title: 'dba update' };
        await request(app)
            .put(`/courses/9999`)
            .send(data)
            .expect(HTTP_STATUS.NOT_FOUND_404);
    });

    it ('should update course with correct input data', async () => {
        const data: CourseUpdateModel = { title: 'dba update' };
        await request(app)
            .put(`/courses/${createdCourse.id}`)
            .send(data)
            .expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app)
            .get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUS.OK_200, {
                ...createdCourse,
                title: data.title
            });
    });

    it ('should delete course with correct input data', async () => {
        await request(app)
            .del(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUS.NO_CONTENT_204);
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, []);
    });

});