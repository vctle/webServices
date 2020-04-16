const validation = require("mw.validation");



class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.options('/api/places', function(request, response) {
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, my-header-custom');
      response.setHeader('Access-Control-Max-Age', 'max-age=30');
      response.json();
    });

    app.get("/api/places", function(request, response) {
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      response.setHeader('Access-Control-Allow-Methods', 'GET');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, my-header-custom');
      response.setHeader('Cache-Control', 'public, max-age=15');

      return data.getPlacesAsync().then(function(place) {
        if (place !== undefined) {
          response.status(200).json(place);
          return;
        }
        response.status(404).json({
          key: "entity.not.found"
        });
      });;
    })
    
    app.get("/api/places/:id", function(request, response) {
      let id = request.params.id;
      return data.getPlaceAsync(id).then(function(place) {
        if (place !== undefined) {
          response.status(200).json(place);
          return;
        }
        response.status(404).json({
          key: "entity.not.found"
        });
      });
    });

    app.post("/api/places", function(request, response) {
      response.setHeader("Location", "places");

      console.log(request.body);
      const place = request.body;

      var onlyIf = function() {
        if(place.image && place.image.url){
          return true;
        }
        return false;
      }
      let validated = false;

      // A noter qu'ici il y a plusieurs manière de le faire, pour éviter la répetition de code je peux tres bien faire basicRules
      // et ensuite ajouter des règles dans la meme var si il y a une image et url
      if(onlyIf)
      {
        const imageRules = {
          name: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ],
          author: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}}  ],
          review: ['required', 'digit' ],
          '@image': {
            url: ['url'],
            title: [{ required: {onlyIf:onlyIf, message: 'Field Image title is required' }} , { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ]
          }
        }
        validated = validation.objectValidation.validateModel(place, imageRules);
      }
      else {
        const basicRules = {
          name: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ],
          author: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}}  ],
          review: ['required', 'digit' ]
        }
        validated = validation.objectValidation.validateModel(place, basicRules);
      }
      console.log(validated.success);

      if(validated.success) {
        return data.savePlaceAsync(place).then(function(id, name) {
          response.status(201).json({
            id: id,
          });
        });
      }
      else {
        response.status(400).json({
          error: "http 400"
        })
      }
    })

    app.delete("/api/places/:id", function(request, response) {
      response.setHeader("Location", "places");
      let id = request.params.id;
      return data.deletePlaceAsync(id).then(function(deleted) {
        console.log(deleted);
        if(deleted) {
          response.status(204).json();
          return;
        }
        else {
          response.status(400).json({
            http: "400 Bad Request"
          })
          return;
        }
      });
    })

    app.put("/api/places/:id", function(request, response) {
      response.setHeader("Location", "places");
      let id = request.params.id;
      let place = request.body;
      if(place.hasOwnProperty('name'))
      {
        // Ici on réutilise les vérifications du POST, Une bonne méthode serait de faire une fonction de validation au lieu de répeter
        var onlyIf = function() {
          if(place.image && place.image.url){
            return true;
          }
          return false;
        }
        let validated = null;
  
        // A noter qu'ici il y a plusieurs manière de le faire, pour éviter la répetition de code je peux tres bien faire basicRules
        // et ensuite ajouter des règles dans la meme var si il y a une image et url
        if(onlyIf)
        {
          const imageRules = {
            name: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ],
            author: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}}  ],
            review: ['required', 'digit' ],
            '@image': {
              url: ['url'],
              title: [{ required: {onlyIf:onlyIf, message: 'Field Image title is required' }} , { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ]
            }
          }
          validated = validation.objectValidation.validateModel(place, imageRules);
        }
        else {
          const basicRules = {
            name: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}} ],
            author: ['required', {minLength: { minLength: 3}}, { maxLength : { maxLength: 100 }}, {pattern: { regex: /^[a-zA-Z -]*$/}}  ],
            review: ['required', 'digit' ]
          }
          validated = validation.objectValidation.validateModel(place, basicRules);
        }
        console.log(validated.success);
  
        if(validated.success) {
          return data.savePlaceAsync(place).then(function(id, name) {
            response.status(201).json({
              id: id,
            });
          });
        }
        else {
          response.status(400).json({
            error: "http 400"
          })
        }
      }
      else {
        response.status(400).json({
          http: "400 Bad request"
        });
        return;
      }
    })
  }
}
module.exports = Places;
