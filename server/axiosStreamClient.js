const axios = require('axios');
const httpAdapter = requir('axios/lib/adapters/http');

export default axios.create({
    responseType: 'stream',
    adapter: httpAdapter
})