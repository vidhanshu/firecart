function containsSpecialChars(str) {
    const specialChars = /[`()[\]]/;
    return specialChars.test(str);
}

export default containsSpecialChars;