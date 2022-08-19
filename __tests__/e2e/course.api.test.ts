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
        await request(app)
            .post('/course')
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400);
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, []);
    });

    let createdCourse: any = null;
    it ('should create course with correct input data', async () => {
        const createResponse: any = await request(app)
            .post('/course')
            .send({title: 'dba'})
            .expect(HTTP_STATUS.CREATED_201);

        createdCourse = createResponse.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'dba'
        });

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [createdCourse]);
    });

    it ('should\'nt update course with correct input data', async () => {
        await request(app)
            .put(`/courses/${createdCourse.id}`)
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400);

        await request(app)
            .get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUS.OK_200, createdCourse);
    });

    it ('should\'nt update course that not exist', async () => {
        await request(app)
            .put(`/courses/9999`)
            .send({title: 'dba update'})
            .expect(HTTP_STATUS.NOT_FOUND_404);
    });

    it ('should update course with correct input data', async () => {
        await request(app)
            .put(`/courses/${createdCourse.id}`)
            .send({title: 'dba update'})
            .expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app)
            .get(`/courses/${createdCourse.id}`)
            .expect(HTTP_STATUS.OK_200, {
                ...createdCourse,
                title: 'dba update'
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