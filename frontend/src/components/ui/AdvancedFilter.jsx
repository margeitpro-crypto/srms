import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import Select from './Select';
import Input from './Input';

const AdvancedFilter = ({
  columns = [],
  onFilterChange,
  className = '',
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const addFilter = () => {
    const newFilterId = Date.now();
    setFilters(prev => ({
      ...prev,
      [newFilterId]: {
        column: columns[0]?.key || '',
        operator: 'contains',
        value: ''
      }
    }));
  };

  const removeFilter = (filterId) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const updateFilter = (filterId, field, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: {
        ...prev[filterId],
        [field]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ];

  const filterCount = Object.keys(filters).length;

  return (
    <div className={twMerge('mb-4', className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls="advanced-filter-panel"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
          {filterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
              {filterCount}
            </span>
          )}
        </Button>
        
        {filterCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            aria-label="Clear all filters"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {isOpen && (
        <div 
          id="advanced-filter-panel"
          className="mt-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <div className="space-y-4">
            {Object.keys(filters).length > 0 ? (
              Object.entries(filters).map(([filterId, filter]) => (
                <div key={filterId} className="flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column
                    </label>
                    <Select
                      value={filter.column}
                      onChange={(e) => updateFilter(filterId, 'column', e.target.value)}
                      options={columns.map(col => ({
                        value: col.key,
                        label: col.title
                      }))}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operator
                    </label>
                    <Select
                      value={filter.operator}
                      onChange={(e) => updateFilter(filterId, 'operator', e.target.value)}
                      options={operatorOptions}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <Input
                      type="text"
                      value={filter.value}
                      onChange={(e) => updateFilter(filterId, 'value', e.target.value)}
                      placeholder="Enter filter value"
                    />
                  </div>
                  
                  <div className="pb-1">
                    <Button
                      variant="danger"
                      onClick={() => removeFilter(filterId)}
                      aria-label="Remove filter"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No filters applied. Add a filter to get started.
              </p>
            )}
            
            <div className="flex justify-between pt-2">
              <Button
                variant="secondary"
                onClick={addFilter}
                aria-label="Add new filter"
              >
                + Add Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;