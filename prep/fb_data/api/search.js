const rp = require('request-promise');
const fs = require('fs');
const destFilePath = __dirname + '/rawresults.json';

// initial params
var aToken = "EAACEdEose0cBAMjEzRnUx3kjUigs0iOsUTaUbOZC0DLYKO9J5xsusFS45wnTxt0Jpzpao9OZCjIRUK8THTuE62hYJus1ikaPchmbbm6zaGcgEwxFXJNPl3AKzTO1N7fANZCDZCoSq40iTHKuzeaH0k70yAg45jZA8fFZAdmKZAXeDUTOmYmvelmwUZCvK7vd2ZBIZD";

// done: "diving", "dive resort", "dive center/ centre", "scuba", "diving indonesia", "scuba indonesia", "scuba diving indonesia"  
var searchTerm = "dive indonesia";

var params = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.9/search`,
    qs: {
        access_token: aToken,
        q: searchTerm,
        type: 'place',
        // categories: ["TRAVEL_TRANSPORTATION"],
        // categories: ["FITNESS_RECREATION"],
        fields: 'name, location'
    }
}

/*
suspect needs to come first - otherwise the readstream will overwrite
*/

// create dataObject first - def can refactor
var dataObject = JSON.parse(fs.readFileSync(destFilePath));

// create writestream outside so you don't recurse the open/ closing
var destStream = fs.createWriteStream(destFilePath);

function callFB(params) {
    console.log("Q sending to" + params.uri);

    rp(params)
        .then(function(result){
            console.log("Q success to" + params.uri);

            // fb returns a JSON string, converts to array
            var parseResult = JSON.parse(result);            
            var fbData = parseResult.data;

            // for each in array
            for (var i in fbData) {
                if (fbData[i].location && fbData[i].location.country === "Indonesia" && !dataObject[fbData[i].id])
                    dataObject[fbData[i].id] = fbData[i];
            }
            console.log('\t>>>> dataObject now has %d elements', Object.keys(dataObject).length);

            if (parseResult.paging && parseResult.paging.next) {
                // re-assign params
                params = {
                    uri : parseResult.paging.next
                };
                // recursion has to be deepest level - not true recursion, just planting in the future
                // because we are not creating another execution context, we are finishing this one
                setTimeout(callFB(params), 5000);
            } else {
                destStream.write(JSON.stringify(dataObject, null, 4));
                console.log(`Query complete: ${Object.keys(dataObject).length} records to the file`);
                destStream.end();
            }
        })
        .catch(function(err){
            console.log(err);
        });
}

// call with initial params
callFB(params);


