"use client"

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
        onChange([...headers, { key: "", value: ""}]);
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
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Headers</h3>
                <button
                    onClick={addHeader}
                    className="text-blue-600 text-sm hover:underline"
                >
                    + Add
                </button>
            </div>

            <div className="border rounded-md overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Key</th>
                            <th className="px-3 py-2 text-left">Value</th>
                            <th className="px-3 py-2 w-12"></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {headers.map((header, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        value={header.key}
                                        onChange={(e) => updateHeader(idx, "key", e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                        placeholder="Content-Type"
                                    />
                                </td>

                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        value={header.value}
                                        onChange={(e) => updateHeader(idx, "value", e.target.value)}
                                        className="w-full border founded px-2 py-1"
                                        placeholder="application/json"
                                    />
                                </td>

                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => deleteHeader(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {headers.length === 0 && (
                    <div className="p-3 text-gray-400 text-sm text-center">
                        No headers. Click &quot;+ Add&quot; to add HTTP headers.
                    </div>
                )}
            </div>
        </div>
    );
}