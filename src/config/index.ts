import { config } from "dotenv";

const configEnv = () => {
  //Load main env file
  config({ path: "src/config/.env" });
  //Chose mode
  const mode = process.env.NODE_ENV;

  //Load the config file
  config({ path: `src/config/${mode}.env` });
};
export default configEnv;
