interface objectPagination {
    currentPage: number,
    limitItems: number,
    skip?: number,
    totalPage?: number
}

const paginationHelper = (objectPagination: objectPagination, query: Record<string, any>, countRecords: number): objectPagination => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
    objectPagination.totalPage = totalPage; 

    return objectPagination;
}

export default paginationHelper;