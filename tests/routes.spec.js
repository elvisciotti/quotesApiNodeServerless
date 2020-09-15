const axios = require('axios');
const BASE_URL = `http://127.0.0.1:3001`;
const tag = 'age';

describe("Endpoint integration tests", () => {

    it("tests /tags endpoint", async () => {
        const response = await axios.get(`${BASE_URL}/tags`);

        expect(response.status).toBe(200);
        expect(response.data.length).toEqual(114);
        response.data.forEach((tag) => expect(tag.length).toBeGreaterThan(2));
    });


    it("tests /quotes default params", async () => {
        const response = await axios.get(`${BASE_URL}/quotes`);

        expect(response.status).toBe(200);
        expect(response.data[0].quote).toBeDefined();
        expect(response.data[0].quote).toBeDefined();
        expect(response.data[0].tag).toBeDefined();
    });

    it("tests /quotes with limit and tag filter  work", async () => {
        const limit = 2;
        const response = await axios.get(`${BASE_URL}/quotes?limit=${limit}&tag=${tag}`);

        expect(response.status).toBe(200);
        expect(response.data.length).toEqual(2);
        for (let i = 0; i < limit; i++) {
            expect(response.data[i].quote).toBeDefined();
            expect(response.data[i].author).toBeDefined();
            expect(response.data[i].tag).toEqual(tag);
        }
    });
});

