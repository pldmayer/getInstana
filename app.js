const express = require('express');
const bdyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const dbName = 'app_dev_c95a54d8eda448c49628a4b29e486b93';
// const viewUrl = '_design/database/_view/Instana?reduce=false&include_docs=true';
const viewUrl = '_design/database/_view/viewinsert';

const couch = new NodeCouchDb({
    host: 'pldmayer.ddns.net',
    auth: {
        user: 'ToUCM318LysnXzESzOozKBIsQtFuwC7l',
        password: 'tLjhOLzM2QI8k99lzTF1gZQogsViV3zy'
    },
    port: 4005
});

const url ='https://apm-santova.instana.io/api/events';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'apiToken rhjbN04BSZaIDQCGR_7pvQ'
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    couch.get(dbName, viewUrl).then(
        function(data, headers, status){
            res.render('index', {
                dbName:data.data.rows
        });
        },
        function(err){
            res.send(err);
        });

        fetch(url, { method: 'GET', headers: headers })
        .then((res) => {
        return res.json()
        })
        .then((json) => {
        
    json.forEach(function(json) {
        couch.insert(dbName, {
            _id: 'ro_ta_08c16b3c24c147f7b170cc8dc052ebb5_' + json.eventId,
            eventId: ""+json.eventId+"",
            start: +json.start,
            end: +json.end,
            triggeringTime: +json.end,
            type: ""+json.type+"",
            state: ""+json.state+"",
            problem: ""+json.problem+"",
            detail: ""+json.detail+"",
            severity: ""+json.severity+"",
            entityName: ""+json.entityName+"",
            entityLabel: ""+json.entityLabel+"",
            entityType: ""+json.entityType+"",
            fixSuggestion: ""+json.fixSuggestion+"",
            snapshotId: ""+json.snapshotId+"",
            tableId: "ta_08c16b3c24c147f7b170cc8dc052ebb5"
            });
        });
      });


});

app.listen(3000, function(){
    console.log('Server is up');
});