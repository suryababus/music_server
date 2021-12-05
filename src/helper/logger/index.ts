export const log = (...message: any) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...message);
    }
}