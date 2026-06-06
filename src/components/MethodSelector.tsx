"use client";

interface Props {
    method: string;
    onChange: (method: string) => void;
}

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]

export function MethodSelector({ method, onChange}: Props) {
    return (
        <select
            value={method}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded-md px-3 py-2 bg-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
            >
            {methods.map((m) => (
                <option key={m} value={m}>
                    {m}
                </option>
            ))}
        </select>
    );
}