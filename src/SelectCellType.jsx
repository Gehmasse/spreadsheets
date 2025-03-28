import { useGlobalState } from "./hooks/useGlobalState";
import { isnull } from "./lib/notnull";

export default function SelectCellType() {
    const { cursor, cell, updateTable } = useGlobalState();

    return (
        <select
            disabled={!cursor}
            value={(cursor && cell?.type) ?? ""}
            onChange={(e) => {
                updateTable(cursor.y, cursor.x, {
                    type: e.target.value,
                });

                if (e.target.value === "checkbox" && isnull(cell.data)) {
                    updateTable(cursor.y, cursor.x, {
                        data: 0,
                    });
                }
            }}
            className="h-full bg-gray-800 w-40 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
        >
            <option></option>
            <option>checkbox</option>
            <option>percent</option>
            <option>money</option>
            <option>special</option>
            <option>select</option>
        </select>
    );
}
