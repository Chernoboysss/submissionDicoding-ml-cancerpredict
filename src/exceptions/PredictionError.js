class PredictionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PredictionError';
        this.statusCode = 400;
    }
}

module.exports = PredictionError;