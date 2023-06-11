const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPaginationSkipAndLimit(count, page) {
    const limit = Math.abs(count) || DEFAULT_PAGE_LIMIT;
    page = Math.abs(page) || DEFAULT_PAGE_NUMBER;
    const skip = (page - 1) * 50;
    return {
        skip,
        limit,
    }
}

module.exports = getPaginationSkipAndLimit;