import { isEmail, isPhoneNumber, isURL } from "./lib/types";

export default function CellData({ cell }) {
    if (cell.type === "special" && isEmail(cell.data)) {
        return <a className="underline decoration-gray-400" href={`mailto:${cell.data}`}>{cell.data}</a>;
    }

    if (cell.type === "special" && isURL(cell.data)) {
        return <a className="underline decoration-gray-400" href={`${cell.data}`}>{cell.data}</a>;
    }

    if (cell.type === "special" && isPhoneNumber(cell.data)) {
        return <a className="underline decoration-gray-400" href={`tel:${cell.data}`}>{cell.data}</a>;
    }

    return (
        <span
            className={`${cell.bold && "font-bold"}
                ${cell.underline && "underline"}
                ${cell.italic && "italic"}`}
        >
            {cell.data}
        </span>
    );
}
