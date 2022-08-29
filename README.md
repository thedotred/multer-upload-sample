![file upload process](https://elasticbeanstalk-ap-southeast-1-677312808939.s3.ap-southeast-1.amazonaws.com/uploads/notes/TDRL_Banner.png)

# 🗎 Upload files using Multer
👨‍💻 Documentation for TDRL Developers

With the increasing demand for file upload with each record in database, it is important to understand how multer works in nodejs application. Companies want to keep records and files in the same application or at least they want to access files with each records. 

Please keep in mind that this repository is prepared for illustration purpose only. We already have a separate module to upload files.

## 🚀 How file upload works
We use multer to upload any kind of files into the server. The file upload process is a 3 stage process:
1. Select file from the front-end and send it to the back-end using HTML form element
2. The back-end receives the file and changes the name of the file (if required)
3. Server stores the file in the storage

![file upload process](https://elasticbeanstalk-ap-southeast-1-677312808939.s3.ap-southeast-1.amazonaws.com/uploads/notes/upload_process.png)
*Figure 1: 3 step process to upload files*

## 💻 Lets go through each of the steps

### Step 1: Create a front-end view
At first, we need to create the front-end view file. In the view, there should be a form element. The form element must have the following attributes:
1. action `you need to define the location where the form-data will be sent`
2. method `define how you want to send data.`
3. enctype `how data should be encoded.`

[More about HTML Form attributes](https://www.w3schools.com/html/html_forms_attributes.asp)

Generally, this is what the form should look like

```html
<form action="/excel/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
  <input type="submit" value="Click to upload"/>
</form>
```
![form structure for multer](https://elasticbeanstalk-ap-southeast-1-677312808939.s3.ap-southeast-1.amazonaws.com/uploads/notes/html_form_description.png)
*Figure 2: Description of the HTML form structure for multer upload*

### Step 2: Install multer by running the following command
```javascript
npm i --save multer
```
### Step 3: Along with other packages, import multer in your controller
I am assuming you already have a project up and running. In the porject, just run the following command.
```javascript
const express = require("express"),
multer = require("multer"); //Import the multer package here

const app = express();
```
### Step 4: Setup Multer
Once multer package is installed, then you have to decide two things:  
1. where you want the file to be uploaded and
2. if you want to `change the file name` when saving. Changing the file name is important because multer replaces files with the same name. So if you dedice to change the file name, then you might need the `new file name` to work with later. In our case, we always change the file name. We just prefix a timestamp with the original file name. 

Lets consider few scenarios in the following example:

**Scenario 1 ('dest' option)**: No change in file name and the files will be uploaded in the same desitination/folder. 

So to use multer, you need call the `multer method`. In the muster method, you need to define the upload destination/folder in the `dest` option (shown as below):
```javascript
const upload = multer({ 
    // 'dest' is one of many options available in multer
    // 'public/uploads' is where we want to upload the file
    dest: 'public/uploads'
});
```
**Scenario 2 ('storage' option)**: Upload destination/folder may change and file name will also change. 

In this case, we need to keep the upload destination dynamic. So to use multer, you need to call the `multer method`. Since the file name will change and the upload destination/folder can be different in different situations, hence you need to use multer's `diskStorage` engine. The `diskStorage` gives you *full controll of setting dynamic destination and change file name* (shown as below) :
```javascript
// Configure the 'diskStorage'
const attachmentStorage = multer.diskStorage({
    // in 'destination' option, you can either run a
    // database query to get the destination name 
    // dynamically OR 
    // if the user sends the destination from the 
    // front-end, you can grab it from 'req' object
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
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
const uploadAttachmentFiles = multer({ storage: attachmentStorage });
```
### Step 5: Call multer in your routes as middleware
Now that you have initiated multer, you need to use multer as middleware only in those routes which will receive file from the front-end.

For `single` file upload, use single method:
```javascript
app.post('/upload', uploadAttachmentFiles.single('files'), async (req,res)=>{
    // Once file is saved, now you have access to 
        // 1. req.file
        // 2. req.body
    // req.file is the name of your file from the form
   // req.body will hold the text fields, if there were any 
   
   // more details about req.file & req.body is described below
});
```
For `multiple` file upload, use array method:
```javascript
app.post('/upload', uploadAttachmentFiles.array('files'), async (req,res)=>{
    // Once file is saved, now you have access to 
        // 1. req.file
        // 2. req.body
    // req.file is the name of your file from the form
   // req.body will hold the text fields, if there were any 
   
   // more details about req.file & req.body is described below
});
```
___
### Details on `req.file` and `req.body`

`req.file` contains the following fields:

|Field Name | Description | Available in |
|-----|-----|-----|
|req.file.fieldname | Field name specified in the form |  |
|req.file.originalname | Original filename before saved |  |
|req.file.mimetype | Mime type of the file |  |
|req.file.size | Size of the file in Bytes |  |
|req.file.destination | Destination folder | `DiskStorage` |
|req.file.filename | Name after saved in Destination folder | `DiskStorage` |
|req.file.path | Full path (destination + filename) | `DiskStorage` |

`req.body` only contains the value of input fields send from the front-end but not anything about the file.

___
## 📦 Dependencies
| Package|Link|Description|
| ------------- | ------------- | ------------- |
| Express.js| [express](https://www.npmjs.com/package/express)| Popular web framework for Node.JS. It makes life easy to create and run servers for Node.JS applications. |
| Multer| [multer](https://www.npmjs.com/package/multer)| Popular middleware for handling file upload. Form must be multipart (multipart/form-data) otherwise it will not process|

## [🌐](https://thedotred.com/) | [💼](https://bd.linkedin.com/company/thedotred) | [🔗](https://www.instagram.com/thedotred/)

## 📓 Changelog