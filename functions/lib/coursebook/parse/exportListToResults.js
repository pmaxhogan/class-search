function exportItemToResult(item) {
    console.log(item);
    if (item.course_prefix === "buan" && item.course_number === "6359") {
        debugger;
    }
    return item;
}

export function exportListToResults(exportList) {
    return exportList.map(exportItemToResult);
}
