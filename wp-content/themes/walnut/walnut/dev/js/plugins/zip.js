// create the blob object storing the data to compress
// var blob = new Blob([ "Lorem ipsum dolor sit amet, consectetuer adipiscing elit..." ], {
//   type : "text/plain"
// });
// creates a zip storing the file "lorem.txt" with blob as data
// the zip will be stored into a Blob object (zippedBlob)
// zipBlob("lorem.txt", blob, function(zippedBlob) {
//   // unzip the first file from zipped data stored in zippedBlob
//   unzipBlob(zippedBlob, function(unzippedBlob) {
//     // logs the uncompressed Blob
//     console.log(unzippedBlob);
//   });
// });

function zipBlob(filename, blob, callback) {
  // use a zip.BlobWriter object to write zipped data into a Blob object

  zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {

    // use a BlobReader object to read the data stored into blob variable
    zipWriter.add(filename, new zip.BlobReader(blob), function() {

      // close the writer and calls callback function
      zipWriter.getEntries(function(entries) {
         if (entries.length) {


           // get first entry content as text
           entries[0].getData(new zip.TextWriter(), function(text) {
             // text contains the entry data as a String
             alert ("blob ", +text)
             console.log(text);

             // close the zip reader
            zipWriter.close(callback);

           }, function(current, total) {
             // onprogress callback
           });
         }
       });
      
    });
  }, onerror);
}

function unzipBlob(blob, callback) {
  // use a zip.BlobReader object to read zipped data stored into blob variable
  zip.createReader(new zip.BlobReader(blob), function(zipReader) {
    // get entries from the zip file
    zipReader.getEntries(function(entries) {
      // get data from the first file
      entries[0].getData(new zip.BlobWriter("text/plain"), function(data) {
        // close the reader and calls callback function with uncompressed data as parameter
        zipReader.close();
        callback(data);
      });
    });
  }, onerror);
}

function onerror(message) {
  console.error(message);
}