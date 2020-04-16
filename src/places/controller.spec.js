const request = require("supertest");
const assert = require("assert");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");

describe("Places/controller", () => {
  it("GET /api/places/2 should respond a http 200 OK", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/2")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.author).toBe("Louis");
      });
  });

  it("GET /api/places/youhou should respond a http 404", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/youhou")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(response => {
        expect(response.body.key).toBe("entity.not.found");
      });
  });

  it("GET /api/places should answer the same number of object than in BDD", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.length, 3);
      });
  });

  it('POST /api/places should respond a http 201 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);
    });

    it('POST /api/places should respond a http 201 OK with an image', () => {

        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre &',
            author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: ''
            }
        };
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    // tests suppression

    it('DELETE /api/places/5 should respond a http 400 id not found', () => {
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .delete("/api/places/5")
        .expect(400)
    });
    
    it('DELETE /api/places/2 should respond a http 204', () => {
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .delete("/api/places/2")
        .expect(204)
    });

    // Test remplacement
    it("PUT /api/places/5 should respond a http 400 ko", () => {
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put("/api/places/5")
        .expect(400)
    })

    // Ici on pourrait faire le test avec tous les cas echéants mais on en choisit qu'un seul
    it("PUT /api/places/2 should respond a http 400 ko", () => {
      const app = new App(new Place(new PlaceData())).app;
      var newPlace = {
        name: 'Londre &',
        author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
        review: 2,
        image: {
            url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
            title: ''
        }
    };

      return request(app)
        .put("/api/places/2")
        .send(newPlace)
        .expect(400)
    })

    it("PUT /api/places/2 should respond a http 200", () => {
      var newPlace = {
        name: 'Londre',
        author: 'Patrick',
        review: 2,
        image: {
            url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
            title: 'bworld place'
        }
    };
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
        .put('/api/places/2')
        .send(newPlace)
        .expect('Location', /places/)
        .expect(201);
    })
});
