const express = require('express');
const app = express();
const streamingClient = require('./axiosStreamClient');
const axios = require('axios')
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


/*
app.get('/api/art/:query', async (req, res) => {
    //make api call to external api
    const response = await axios.get('/api/art/download/:download_url')
    res.send(response)
})

// for future make this a private route so bad actors can't blow up your shit easily
app.get('/api/art/download/:download_url', async (req, res) => {
    try {
        const output = fs.createWriteStream('image.jpg')

        const res = await streamingClient.get('https://images.metmuseum.org/CRDImages/ep/original/DP346474.jpg')

        const stream = res.data;
        stream.on('data', chunk => {
            output.write(new Buffer.from(chunk))
        })

        stream.on('end', () => {
            output.end()
        })

        // file id doesn't exist yet, but send this back to caller as return value
        res.send(fileId)
    } catch (e) {
        throw new Error(e)
    }

})
*/