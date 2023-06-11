const request = require('supertest');
const app = require('../../app');
const { 
    mongoConnect,
    mongnoDisconnect,
} = require('../../services/mongoConnection.service');

describe('Testing APIs', () => {
    beforeAll(() => {
        return mongoConnect();
    });

    afterAll(() => {
        return mongnoDisconnect();
    });

    describe('Test GET /launches', () => {
        test('It should response with 200 success code', () => {
            const response = request(app).get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                });
        });
    });

    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: "Explore Mars",
            rocket: "Janani",
            target: "Kepler-442 b",
            launchDate: "January 17, 2030",
        }
        const launchDataWithoutDate = {
            mission: "Explore Mars",
            rocket: "Janani",
            target: "Kepler-442 b",
        }

        test('It should response with 201 created success code', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(response.body).toMatchObject(launchDataWithoutDate);
            expect(requestDate).toBe(responseDate);
        });

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Missing required property for launch',
            });
        });

        test('It should catch invalid date', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send({
                    ...launchDataWithoutDate,
                    launchDate: "hello this is not date",
                })
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            })
        });
    });
});
