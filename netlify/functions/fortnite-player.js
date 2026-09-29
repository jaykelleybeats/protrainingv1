exports.handler = async (event) => {
  const username = event.queryStringParameters?.username?.trim();
  if (!username) return { statusCode: 400, headers:{'content-type':'application/json'}, body: JSON.stringify({error:'Missing Fortnite username.'}) };
  return {
    statusCode: 200,
    headers: {'content-type':'application/json','cache-control':'no-store'},
    body: JSON.stringify({username, profileUrl:`https://fortnitetracker.com/profile/all/${encodeURIComponent(username)}`})
  };
};
