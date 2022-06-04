function findImageNameFromUrl(URL) {
    const array = URL.split("/");
    const image_name_ke_thoda_pass = array[7];
    const idx = image_name_ke_thoda_pass.lastIndexOf('?');
    const image_name = image_name_ke_thoda_pass.substring(0, idx).replace(/%20/g, " ");
    return image_name
}

export default findImageNameFromUrl