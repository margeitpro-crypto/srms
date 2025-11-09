import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { twMerge } from 'tailwind-merge';

const VirtualizedTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onSort = null,
  sortable = true,
  hoverable = true,
  striped = false,
  compact = false,
  responsive = true,
  rowHeight = 50,
  className = '',
  emptyMessage = 'No data available',
  loadingRows = 5,
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = useMemo(() => {
    if (!sortConfig || !onSort) return data;

    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [data, sortConfig, onSort]);

  const handleSort = (column) => {
    if (!column.sortable || !sortable) return;

    const newDirection =
      sortConfig?.key === column.key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    const newSortConfig = { key: column.key, direction: newDirection };
    setSortConfig(newSortConfig);

    if (onSort) {
      onSort(newSortConfig);
    }
  };

  const tableClasses = twMerge(
    'min-w-full divide-y divide-gray-200',
    className
  );

  const theadClasses = twMerge(
    'bg-gray-50',
    compact && 'bg-gray-25'
  );

  const getSortIcon = (column) => {
    if (!column.sortable || !sortable) return null;

    const isActive = sortConfig?.key === column.key;
    const direction = sortConfig?.direction;

    return (
      <span className="ml-2 inline-flex flex-col items-center">
        <svg
          className={twMerge(
            'h-3 w-3 -mb-1',
            isActive && direction === 'asc' ? 'text-gray-900' : 'text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <svg
          className={twMerge(
            'h-3 w-3',
            isActive && direction === 'desc' ? 'text-gray-900' : 'text-gray-400'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  };

  const renderCell = (item, column, rowIndex) => {
    if (column.render) {
      return column.render(item[column.key], item, rowIndex);
    }
    return item[column.key] || '';
  };

  // Row renderer for virtualized list
  const Row = useCallback(({ index, style }) => {
    const item = sortedData[index];
    return (
      <tr
        style={style}
        key={item.id || index}
        className={twMerge(
          striped && index % 2 === 1 && 'bg-gray-50',
          hoverable && 'hover:bg-gray-50 transition-colors duration-150'
        )}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className={twMerge(
              'px-3 py-2 whitespace-nowrap text-sm sm:px-6 sm:py-4',
              compact && 'px-2 py-1.5 sm:px-4 sm:py-2'
            )}
          >
            {renderCell(item, column, index)}
          </td>
        ))}
      </tr>
    );
  }, [sortedData, columns, striped, hoverable, compact]);

  const LoadingSkeleton = () => (
    <div className="bg-white divide-y divide-gray-200">
      {Array.from({ length: loadingRows }, (_, index) => (
        <div 
          key={`loading-${index}`} 
          className={twMerge(
            'flex',
            striped && index % 2 === 1 && 'bg-gray-50'
          )}
          style={{ height: rowHeight }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className={twMerge(
                'px-6 py-4 whitespace-nowrap',
                compact && 'px-4 py-2'
              )}
              style={{ width: `${100 / columns.length}%` }}
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={twMerge('flex flex-col', responsive && 'overflow-x-auto')}>
        <div className="-my-2 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className={tableClasses} {...props}>
                <thead className={theadClasses}>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={twMerge(
                          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                          compact && 'px-4 py-2',
                          column.headerClassName
                        )}
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <LoadingSkeleton />
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge('flex flex-col', responsive && 'overflow-x-auto')}>
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className={tableClasses} {...props}>
              <thead className={theadClasses}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={twMerge(
                        'px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none sm:px-6 sm:py-3',
                        compact && 'px-2 py-1.5 sm:px-4 sm:py-2',
                        column.sortable && sortable && 'cursor-pointer hover:bg-gray-100',
                        column.headerClassName
                      )}
                      onClick={() => handleSort(column)}
                      tabIndex={column.sortable && sortable ? 0 : -1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSort(column);
                        }
                      }}
                      aria-sort={
                        sortConfig?.key === column.key
                          ? sortConfig.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div className="flex items-center">
                        {column.title}
                        {getSortIcon(column)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            {sortedData.length === 0 ? (
              <div className="px-6 py-12 whitespace-nowrap text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <svg
                    className="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900 mb-1">No data found</p>
                  <p className="text-sm text-gray-500">{emptyMessage}</p>
                </div>
              </div>
            ) : (
              <List
                height={Math.min(500, sortedData.length * rowHeight)}
                itemCount={sortedData.length}
                itemSize={rowHeight}
                width="100%"
              >
                {Row}
              </List>
            )}
          </div>
        </div>
      </div>

      {pagination && (
        <div className="mt-4">
          {pagination}
        </div>
      )}
    </div>
  );
};

// Pagination component for virtualized table
VirtualizedTable.Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  className = ''
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className={twMerge('flex items-center justify-between bg-white px-4 py-3 sm:px-6', className)}>
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>

          {showSizeChanger && (
            <div className="ml-6 flex items-center">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-700 mr-2">Show:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label="Items per page"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                className={twMerge(
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  page === '...' && 'cursor-default'
                )}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={page === '...' ? 'Ellipsis' : `Go to page ${page}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTable;