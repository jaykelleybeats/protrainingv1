exports.handler = async () => ({
  statusCode: 200,
  headers: {'content-type':'application/json'},
  body: JSON.stringify({ok:true, message:'Use the public Fortnite Tracker profile connection in DropZone.'})
});
