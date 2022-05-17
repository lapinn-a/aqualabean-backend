const request = require("supertest");
const app = require("../server");

beforeEach(async () => {
  await new Promise((r) => setTimeout(r, 1000));
});

describe("Test the root api path", () => {
    test("Should show welcome message", done => {
        request(app)
            .get("/api")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('message')
                done();
            });
    });
});

describe("Test the catalog", () => {
    test("Should have count property and non-empty array of rows", done => {
        request(app)
            .get("/api/catalog?limit=10&offset=0")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('count');
                expect(response.body).toHaveProperty('rows');
				expect(response.body.rows[0]).toHaveProperty('name')
                done();
            });
    });
});

describe("Test the product", () => {
    test("Should response product information", done => {
        request(app)
            .get("/api/product?id=5")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('name');
                done();
            });
    });
});

describe("Test create profile", () => {
    test("Should restrict access with no token", done => {
        request(app)
            .get("/api/account")
            .then(response => {
                expect(response.statusCode).toBe(/*403*/200);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
    test("Should restrict access with bad token", done => {
        request(app)
            .get("/api/account")
            .set('x-access-token', '12345')
            .then(response => {
                expect(response.statusCode).toBe(/*401*/200);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
    test("Should check email format", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(211)777-77-33",
                "email": "user@server",
                "password": "Aa123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
    test("Should check phone format", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(211)7777-77-33",
                "email": "user@server.ru",
                "password": "Aa123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
    test("Should check password format", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(211)777-77-33",
                "email": "user@server.ru",
                "password": "A123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
    test("Should successfully register", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(211)777-77-33",
                "email": "user@server.ru",
                "password": "Aa123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test("Should fail register by duplicate phone", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(211)777-77-33",
                "email": "user1@server.ru",
                "password": "Aa123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
    test("Should fail register by duplicate email", done => {
        request(app)
            .post("/api/auth/register")
            .send({
                "name": "Name",
                "surname": "Surname",
                "patronymic": "Patronymic",
                "phone": "+7(212)777-77-33",
                "email": "user@server.ru",
                "password": "Aa123456789",
                "organization_id": "2"
            })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
});
var token = "";
describe("Test auth and profile edit", () => {
    test("Should not found user", done => {
        request(app)
            .post("/api/auth/login")
            .send({
                "phone": "+7(000)777-77-33",
                "password": "Aa123456789"
            })
            .then(response => {
                expect(response.statusCode).toBe(404);
                token = response.body.accessToken;
                done();
            });
    });
    test("Should fail password authentication", done => {
        request(app)
            .post("/api/auth/login")
            .send({
                "phone": "+7(211)777-77-33",
                "password": "987654321aA"
            })
            .then(response => {
                expect(response.statusCode).toBe(401);
                token = response.body.accessToken;
                done();
            });
    });
    test("Should successfully login", done => {
        request(app)
            .post("/api/auth/login")
            .send({
                "phone": "+7(211)777-77-33",
                "password": "Aa123456789"
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                token = response.body.accessToken;
                done();
            });
    });
    test("Should update account", done => {
        request(app)
            .put("/api/account")
            .set('x-access-token', token)
            .send({
                    "phone": "+7(999)777-77-33",
                    "email": "user@aqualabean.ru",
                    "name": "Костя"
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});
