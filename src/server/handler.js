const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
  const { image } = request.payload;

  try {
      const { model } = request.server.app;
      const { confidenceScore,label, suggestion } = await predictClassification(model, image);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const data = {
          "id": id,
          "result": label,
          "suggestion": suggestion,
          "createdAt": createdAt,
          "confidenceScore": confidenceScore,
      };

      // await storeData(id, data);
      
      // if (confidenceScore <= 10){
      //   const response = h.response({
      //     status: 'fail',
      //     message : 'Terjadi kesalahan dalam melakukan prediksi'
      //   });
      //   response.code(400);

      //   return response ;
      // }


      const response = h.response({
          status: 'success',
          message: 'Model is predicted successfully',
          data
      });
      response.code(201);
      return response;


  } catch (error) {
      if (error instanceof InputError) {
          // Ubah status menjadi 400 untuk kesalahan input
          return h.response({
              status: 'fail',
              message: error.message
          }).code(400);
      }
      // Ubah status menjadi 400 untuk kesalahan prediksi
      return h.response({
          status: 'fail',
          message: 'Terjadi kesalahan dalam melakukan prediksi.'
      }).code(400);
  }
}

module.exports = postPredictHandler;
