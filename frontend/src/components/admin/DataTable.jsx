import React from 'react';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import EmptyState from './EmptyState.jsx';
import Pagination from './Pagination.jsx';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = '_id',
  isLoading = false,
  emptyIcon = 'folder_open',
  emptyTitle,
  emptyDescription,
  pagination,
  onRowClick,
  className = ''
}) => {
  if (isLoading) {
    return <LoadingSkeleton rows={5} type="table" className={className} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1 ${className}`}>
      <div className="overflow-x-auto admin-scrollbar">
        <table className="w-full text-left text-xs text-[#282B24] dark:text-[#F7F0E3]">
          <thead className="bg-[#F7F0E3]/70 dark:bg-[#282B24]/60 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 text-[#795640] dark:text-[#A5AD91] uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-4 py-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9D8B9]/40 dark:divide-stone-700/40">
            {data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-[#F7F0E3]/40 dark:hover:bg-[#282B24]/40'
                    : 'hover:bg-stone-50/60 dark:hover:bg-stone-800/30'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`px-4 py-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
