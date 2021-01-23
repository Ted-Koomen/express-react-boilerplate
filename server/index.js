const express = require('express');
const app = express();
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http')
const fs = require('fs');


app.get('/', async (req, res) => {
    try {
        const output = fs.createWriteStream('image.jpg')

        axios.get(
            'https://images.metmuseum.org/CRDImages/ep/original/DP346474.jpg',
            {
                responseType: 'stream',
                adapter: httpAdapter
            }
        )
            .then(res => {
                const stream = res.data;
                stream.on('data', chunk => {
                    console.log('writing')
                    output.write(new Buffer.from(chunk))
                })

                stream.on('end', () => {
                    console.log("done")
                    output.end()
                })
            })
            .catch(e => {
                console.log(e)
            })
    } catch (e) {
        console.log(e)
    }
})

app.listen(5000, () => {
    console.log("Listening on 5000")
})