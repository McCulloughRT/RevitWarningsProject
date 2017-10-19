# RevitWarningsProject
NodeJS backend for the Revit Warnings Project

The active phase of this project has ended, [click here to view an archived version of the frontend!](http://ryantm.io/revitWarnings/)

Start with xprs.js, this is the node server app and it calls all other classes.
<ul>
<li>html2db.js parses the html upload using cheerio, hashes the results, and compares to the database to prevent duplicates. It then saves the new documents to mongodb.</li>
<li>query.js runs after a new file has been uploaded and queries mongodb for statistics on all the documents. results are saved as a json in the ./public directory</li>
<li>warning.js is the mongodb schema for this project</li>
<li>remove.js is called when a user wants to remove a previously uploaded project. It hashes the upload and searches the database for matches, removing any it finds.</li>
</ul>

Client side javascript utilizes standard D3 and jQuery for AJAX loading of the JSON file, and generation of graphs.
