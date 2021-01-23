const express = require('express');
const app = express();
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http')
const fs = require('fs');


app.get('/', async () => {
    try {
        const output = fs.createWriteStream('image.jpg')

        const res = await axios.get('https://images.metmuseum.org/CRDImages/ep/original/DP346474.jpg',
            { responseType: 'stream', adapter: httpAdapter }
        );
        
        const stream = res.data;
        stream.on('data', chunk => {
            output.write(new Buffer.from(chunk))
        })

        stream.on('end', () => {
            output.end()
        })

    } catch (e) {
        console.log(e)
    }
})

app.listen(5000, () => {
    console.log("Listening on 5000")
});
