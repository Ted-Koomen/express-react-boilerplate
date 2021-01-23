const express = require('express');
const app = express();
const AWS = require('aws-sdk')
const streamingClient = require('./axiosStreamClient');
const axios = require('axios')
const httpAdapter = require('axios/lib/adapters/http')
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const uploadToS3 = async (fileId) => {
    const params = {
        Bucket: process.env.UPLOAD_BUCKET,
        Key: file.id,
        Body: fs.readFileSync(pathToFile)
    }

    const data = await s3.upload(params)
    return data.location;
}

app.get('/api/art/:query', async (req, res) => {
    try {
        // make call to external API
        const response = await axios.get('/api/art/download/:download_url')
        const location = await axios.post('/api/upload', {
            params: {
                fileId: response
            }
        })
        
        res.send(location)
    } catch (e) {
        throw new Error(e)
    }
})

// private route so randos cant upload
app.post('/api/upload/:fileId', async (req, res) => {
    try {
        const response = await uploadToS3(req.params.fileId)
        return response
    } catch (e) {
        throw new Error(e)
    }
})

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

app.listen(5000, () => {
    console.log("Listening on 5000")
});
