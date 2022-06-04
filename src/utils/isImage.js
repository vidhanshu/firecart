
const isImage = (file_name) => {
    let condition = false;
    condition = /.jpg|.svg|.png|.jpeg|.gif/.test(file_name);
    return condition;
}


export default isImage