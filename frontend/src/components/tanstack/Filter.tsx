import DebouncedInput from "./DebouncedInput"

export default function Filter({ column }: { column: any }) {
    const columnFilterValue = column.getFilterValue();

    // 'range' 필터 처리
    if (column.columnDef.meta?.filterVariant === 'range') {
        return (
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
        );
    }

    // 'text' 필터 처리
    if (column.columnDef.meta?.filterVariant === 'text') {
        return (
            <DebouncedInput
                className="w-36 border shadow rounded"
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search...`}
                type="text"
                value={(columnFilterValue ?? '') as string}
            />
        );
    }

    // 'select' 필터 처리
    if (column.columnDef.meta?.filterVariant === 'select') {
        return (
            <select
                value={columnFilterValue ?? ''}
                onChange={e => column.setFilterValue(e.target.value)}
                className="border shadow rounded"
            >
                <option value="">All</option>
                <option value="In Relationship">In Relationship</option>
                <option value="Single">Single</option>
                <option value="Complicated">Complicated</option>
            </select>
        );
    }

    return null;
}
