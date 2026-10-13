import app from "./app.js";
import Constant from "./constants.js";

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(Constant.LOG_MESSAGES.SERVER_START(PORT));
});
