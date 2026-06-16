"use client";

interface Header {
  key: string;
  value: string;
}

interface Props {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

export function HeadersTable({ headers, onChange }: Props) {
  const addHeader = () => {
    onChange([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (index: number, field: "key" | "value", newValue: string) => {
    const updated = [...headers];
    updated[index][field] = newValue;
    onChange(updated);
  };

  const deleteHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">Headers</h3>
        <button
          onClick={addHeader}
          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
          + Add
        </button>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-300">Key</th>
              <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-300">Value</th>
              <th className="px-3 py-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header, idx) => (
              <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={header.key ?? ''}
                    onChange={(e) => updateHeader(idx, "key", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Authorization"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={header.value ?? ''}
                    onChange={(e) => updateHeader(idx, "value", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Bearer token"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteHeader(idx)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {headers.length === 0 && (
          <div className="p-3 text-gray-400 dark:text-gray-500 text-sm text-center">
            No headers. Click &quot;+ Add&quot; to add HTTP headers.
          </div>
        )}
      </div>
    </div>
  );
}