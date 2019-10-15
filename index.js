const port = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const fs = require('fs');
const BoxSDK = require('box-node-sdk');

let configFile = fs.readFileSync('./box_config.json');
configFile = JSON.parse(configFile);

const boxSdk = BoxSDK.getPreconfiguredInstance(configFile);

const client = boxSdk.getAppAuthClient('enterprise', configFile.enterpriseID);

// Example of using API to Load file

// var stream = fs.createReadStream('./29.pdf');
// client.files.uploadFile('48021509595', '29.pdf', stream)
//     .then(console.log)
//     .catch(console.log);

// Example of using API to fetch folder
 
// client.folders.getItems(
//     '48021509595',
//     {
//         fields: 'name,modified_at,size,url,permissions,sync_state',
//         offset: 0,
//         limit: 25
//     },
//     (req, res) => console.log(res)
// );

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