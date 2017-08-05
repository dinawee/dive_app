


1. Change your Access Tokens 

Get from here: https://developers.facebook.com/tools/explorer

Update the tokens in 
/client/app/services/fb.service.js



2. Change your config files

A. Config file for Amazon DB credentials 
in: /prep/fb_data/config/development-cloud.js
or /prep/map/config/development-cloud.js

Referenced in: /server/db.js


B. Config file for FB credentials 
in  /prep/fb_data/config/development-cloud.js
or /prep/map/config/development-cloud.js

Referenced in /server/auth.js