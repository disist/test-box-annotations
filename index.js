const port = process.env.PORT || 3000;
const BOX_CLIENT_ID = process.env.BOX_CLIENT_ID;
const BOX_CLIENT_SECRET = process.env.BOX_CLIENT_SECRET;
const BOX_PUBLIC_KEY_ID = process.env.BOX_PUBLIC_KEY_ID;
const BOX_PRIVATE_KEY = process.env.BOX_PRIVATE_KEY;
const BOX_PASSPHRASE = process.env.BOX_PASSPHRASE;
const BOX_ENTERPRISE_ID = process.env.BOX_ENTERPRISE_ID;

const path = require('path');
const express = require('express');

// Initialize SDK
var BoxSDK = require('box-node-sdk');

const boxSdk = BoxSDK.getPreconfiguredInstance({
    "boxAppSettings": {
        "clientID": BOX_CLIENT_ID,
        "clientSecret": BOX_CLIENT_SECRET,
        "appAuth": {
            "publicKeyID": BOX_PUBLIC_KEY_ID,
            "privateKey": BOX_PRIVATE_KEY,
            "passphrase": BOX_PASSPHRASE
        }
    },
    "enterpriseID": BOX_ENTERPRISE_ID
});

const client = boxSdk.getAppAuthClient('enterprise', BOX_ENTERPRISE_ID);

// Example of using API to Load file
/*
var fs = require('fs');
var stream = fs.createReadStream('path/to/file');
client.files.uploadFile('48021509595', 'test.pdf', console.log);
*/

// Example of using API to fetch folder
/* 
client.folders.getItems(
    '48021509595',
    {
        fields: 'name,modified_at,size,url,permissions,sync_state',
        offset: 0,
        limit: 25
    },
    (req, res) => console.log(res)
);
*/

// const fileId = 283930623804;

const app = express();

app.get('/preview-token/:id', function (req, res) {
    client.exchangeToken('item_preview', `https://api.box.com/2.0/files/${req.params.id}`)
        .then(tokenInfo => res.send(tokenInfo.accessToken));
});

// Serve static
const staticDir = path.resolve(__dirname, 'static');
app.use(express.static(staticDir));

app.listen(port);