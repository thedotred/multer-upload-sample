const express = require('express'),
multer = require('multer'),
app = express(),
path = require('path');

// Here we are configuring multer
// Configure the 'diskStorage'
const attachmentStorage = multer.diskStorage({
    // in 'destination' option, you can either run a
    // database query to get the destination name 
    // dynamically OR 
    // if the user sends the destination from the 
    // front-end, you can grab it from 'req' object
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // in 'filename' option, you can change the file name
    // to whatever you want. In our case, we always use
    // timestamp as a prefix (as shown below)
    filename: function (req, file, cb) {
        // 'Date.now()' gives us the timestamp
        cb(null, Date.now() + '-' + file.originalname );
    }
});
// Assign the 'diskStorage' to multer storage
const uploadFiles = multer({ storage: attachmentStorage });

// This is our home page
// We will just send the HTML file
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname+'/Index.html'));
    //__dirname: return the location of your project folder.
});

// This is our upload page
// which we are using in the HTML file's
// action attibute
app.post('/upload', uploadFiles.single('avatar'), (req, res)=>{
    // If no file is found, then send a 
    // file not found response.
    if(!req.file){
        return res.status(200).send('Sorry! File not found.');
    };
    
    // Holding the file metadata in variables
    let originalName = req.file.originalname;
    let newName = req.file.filename;
    let fileSize = req.file.size;
    let savedLocation = req.file.destination;
    let downloadLink = req.file.path;
    let fileType = req.file.mimetype;

    // Sending the metadata in the response
    res.status(200).send(`
        Successfully uploaded. File details: 
        <ul>
            <li><b>Original Name: </b> ${originalName}</li>
            <li><b>New Name: </b> ${newName}</li>
            <li><b>File Size: </b> ${fileSize}</li>
            <li><b>Saved Location: </b> ${savedLocation}</li>
            <li><b>Download Link: </b> ${downloadLink}</li>
            <li><b>File Type: </b> ${fileType}</li>
        </ul>
    `);
});

// Just ensuring server is up and running
app.listen(3000, function(){
    console.log('Sample multer server is running at port 3000');
});