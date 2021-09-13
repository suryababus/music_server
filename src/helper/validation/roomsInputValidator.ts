const post_validate = (req: any) => {
    console.log(req.body)
    var data = JSON.parse(req.body);
    if(data.data == undefined) return false;
    data = data.data;

    return true;
}
const put_validate = (req: any) => {
    return true;
}
  
export {
    post_validate,
    put_validate
}