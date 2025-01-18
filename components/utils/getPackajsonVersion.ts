const getPackajsonVersion = () => {
  const { version } = require("../../package.json");
  return version;
};

export default getPackajsonVersion;
