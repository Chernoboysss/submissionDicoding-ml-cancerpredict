const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        // Gunakan sharp untuk membaca gambar JPEG
        const imageBuffer = Buffer.from(image, 'base64');
        const rawImage = await sharp(imageBuffer).toFormat('jpeg').toBuffer();

        // Decode gambar menggunakan TensorFlow.js
        const tensor = tf.node
            .decodeImage(rawImage, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        // Lakukan prediksi
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100; // Ambil nilai prediksi pertama

        let label;
        let suggestion;

        if (confidenceScore > 50) {
            label = 'Cancer';
            suggestion = "Segera periksa ke dokter!";
        } else {
            label = 'Non-cancer';
            suggestion = "Aman, bukan kanker!";
        }

        return { label, suggestion };
    } catch (error) {
        // Tangani kesalahan saat proses gambar
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
