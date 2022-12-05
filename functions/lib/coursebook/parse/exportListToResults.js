function exportItemToResult(item) {
    console.log(item);
    return item;
}

export function exportListToResults(exportList) {
    return exportList.map(exportItemToResult);
}
