function exportItemToResult(item){
    return item;
}

export function exportListToResults(exportList){
    return exportList.map(exportItemToResult);
}
