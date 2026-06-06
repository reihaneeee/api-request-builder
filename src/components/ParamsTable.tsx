"use client";

interface Param {
    key: string;
    value: string;
}

interface Props {
    params: Param[];
    onChange: (params: Param[]) => void;
}

export function ParamsTable({ params, onChange }: Props) {
    const addParam = () => {
        onChange([...params, {key: "", value: ""}])
    };

    const updateParam = (index: number,  field: "key" | "value", newValue: string) => {
        const updated = [...params];
        updated[index][field] = newValue;
        onChange(updated);
    }
    const deleteParam = (index: number) => {
        const updated = params.filter((_, i) => i !== index);
        onChange(updated);
    }

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-guy-700">Query Parameters</h3>
                <button
                    onClick={addParam}
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
                        {params.map((param, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        value={param.key}
                                        onChange={(e) => updateParam(idx, "key", e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                        placeholder="key"
                                    />
                                </td>
                                
                                <td className="px-3 py-2">
                                    <input
                                        type="text"
                                        value={param.value}
                                        onChange={(e) => updateParam(idx, "value", e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                        placeholder="value"
                                    />
                                </td>

                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => deleteParam(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {params.length === 0 && (
                    <div className="p-3 text-gray-400 text-sm text-center">
                        No parameters. Click &quot;+ Add&quot; to add query params.
                    </div>
                )}
            </div>
        </div>
    );
}