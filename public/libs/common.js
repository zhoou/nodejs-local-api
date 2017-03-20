/**文件上传验证 */
function checkFile(target) {
    var name = target.value;
    var fileName = name.substring(name.lastIndexOf(".")).toLowerCase();
    // 判断文件格式
    if (fileName !== ".json") {
        alert("Please input json file!");
        target.value = "";
        return;
    }
}
