const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

export default axios.create({
    responseType: 'stream',
    adapter: httpAdapter
})