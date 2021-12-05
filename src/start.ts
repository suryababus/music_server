import { startApp } from "./app";
import { log } from "./helper/logger";

process.on("uncaughtException", (err) => {
    log(err);
})
process.on("unhandledRejection", (err) => {
    log(err);
})
try {
    startApp()
} catch (err) {
    log('error in start up', err)
}