const fs = require('fs');
const rp = require('request-promise');

// init 
/*
change token when expire
get token from here: https://developers.facebook.com/tools/explorer
*/
var filename = __dirname + '/rawresults.json';

var aToken = "EAACEdEose0cBAEfBiBEFZCphZAZCOtdRIYaaFY8wvSZCFlqblPru5KCVhZBgwObBJTHVtKAOVMkaCd7gAh8K3Jmkf5XjpuI4Ac7K6g4CXmZCC5fkIkstcC0zoZBdXgzM3FsWkZAxZBOqvO40dULxuC25QX6ka6WdDkftS9ZA57lxJKWN1k2erTr8ftFsZBzd8ZCA0GYZD";
var searchTerm = "diving indonesia";
// done: "diving", "dive resort", "dive center/ centre", "scuba", "diving indonesia", "scuba indonesia", "scuba diving indonesia"  

var dataObject = JSON.parse(fs.readFileSync(filename));


// clean and write to results to memory
function pushArray(fbJSONPage, dataObject) {
    for (var i in fbJSONPage) {
        if (fbJSONPage[i].location && (fbJSONPage[i].location.country === "Indonesia") && fbJSONPage[i].location.city !== "Jakarta" && !dataObject[fbJSONPage[i].id])
            dataObject[fbJSONPage[i].id] = fbJSONPage[i];
    }
    console.log('\t>>>> dataObject now has %d elements', Object.keys(dataObject).length);
}


// parse and set next page in FB results json
function process(fbData) {
    return new Promise(function (resolve, reject) {
        console.log(`Response received`);
        var result = JSON.parse(fbData);
        var fbJSONPage = result.data; // returns JSON.object

        pushArray(fbJSONPage, dataObject);
        setTimeout(function () {
            if (result.paging && result.paging.next) {
                var nextUrl = result.paging.next;
                resolve(nextUrl);
            } else {
                reject(`The end`); // this the end will be called 3s later
            }
        }, 3000);
    });
}

// must pass searchTerm or will keep grabbing from top scope
function callFb(rp, searchTerm) {
    // init
    var params = {
        method: 'GET',
        uri: `https://graph.facebook.com/v2.9/search`,
        qs: {
            access_token: aToken,
            q: searchTerm,
            type: 'place',
            categories: ["TRAVEL_TRANSPORTATION"],
            // categories: ["FITNESS_RECREATION"],
            fields: 'name, location'
        }
    }

    function myLoop(params) {
        return rp(params)
            .then(function (result) {
                return process(result)
            })
            .then(function (nextUrl) {
                var newParams = { uri: nextUrl };
                console.log(`Query to ${ newParams.uri }`);
                return myLoop(newParams); // calling function
            })
            .catch(function (err) {
                console.log('Done with this promise') // every promise called will return this 
                console.log(err);
            })
    }// the .catch will resolve into the .then when called because this is NOT a promise

    // fire the first call
    // need return here also to push return value, other than promise
    return myLoop(params)
        .then(function(result){
            fs.writeFileSync(filename, JSON.stringify(dataObject, null, 4));
            var done = `Written ${Object.keys(dataObject).length} records to the file`
            console.log(done);
            return (done);
        })
        .catch(function(err){
            console.log(err);
        });
}