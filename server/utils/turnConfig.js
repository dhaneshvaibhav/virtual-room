function getIceServers() {
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" }
  ];
  const { TURN_URL, TURN_USERNAME, TURN_PASSWORD } = process.env;
  if (TURN_URL && TURN_USERNAME && TURN_PASSWORD) {
    iceServers.push({
      urls: TURN_URL.split(/\s*,\s*/),
      username: TURN_USERNAME,
      credential: TURN_PASSWORD
    });
  }
  return iceServers;
}
module.exports = { getIceServers };
