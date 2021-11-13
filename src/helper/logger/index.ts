export const log = (...message: any) => {
    console.log("LOG START");
    console.log(...message);
    console.log("LOG END");
}