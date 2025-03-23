import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { emptyTable } from "../lib/emptyTable";
import { find } from "../lib/data";
import { deleteTable, fetchFile, storeTable } from "../lib/fetchFile";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [secondaryCursor, setSecondaryCursor] = useState();
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [clipboard, setClipboard] = useState();
    const [file, setFile] = useState(emptyTable);
    const [uuid, setUuid] = useState(crypto.randomUUID());
    const [showFileList, setShowFileList] = useState(false);
    const [changed, setChanged] = useState(false);

    const inputRef = useRef();

    const table = useMemo(() => file?.body, [file]);
    const filename = useMemo(() => file?.filename, [file]);

    const cell = useMemo(
        () =>
            find(table, cursor.y, cursor.x) ?? {
                x: cursor.x,
                y: cursor.y,
            },
        [table, cursor]
    );

    useEffect(() => {
        fetchFile(uuid, wrapArrayIntoObject(setFile));
    }, [uuid]);

    function onCellChange(cell) {
        console.log({ cell });
    }

    function wrapArrayIntoObject(f) {
        return (data) =>
            Array.isArray(data) ? f({ filename: uuid, body: data }) : f(data);
    }

    function setTable(table) {
        if (Array.isArray(table)) {
            return setFile((file) => ({ ...file, body: table }));
        }

        setFile((file) => ({ ...file, body: table(file.body) }));
    }

    function setFilename(filename) {
        setFile((file) => ({ ...file, filename }));
    }

    function updateTable(y, x, props, overwrite = false) {
        if (table.find((cell) => cell.y == y && cell.x == x)) {
            setTable((table) =>
                table.map((cell) => {
                    if (!(cell.y == y && cell.x == x)) {
                        return cell;
                    }

                    const newCell = overwrite
                        ? { x, y, ...props }
                        : { ...cell, ...props };

                    onCellChange(newCell);

                    return newCell;
                })
            );
        } else {
            const newCell = { y, x, ...props };

            setTable((table) => [...table, newCell]);

            onCellChange(newCell);
        }

        setChanged(true);
    }

    function removeFromTable(y, x) {
        setTable((table) =>
            table.map((cell) => (cell.y == y && cell.x == x ? { x, y } : cell))
        );

        onCellChange({ x, y });

        setChanged(true);
    }

    function closeTable() {
        setFile(emptyTable);
        setChanged(false);
    }

    async function saveTable() {
        const json = JSON.stringify(file, null, 2);

        await storeTable(uuid, json);

        setChanged(false);
    }

    function openTable(newUuid) {
        setUuid(newUuid);
        setShowFileList(false);
    }

    function handleDelete() {
        setUuid(crypto.randomUUID());
        deleteTable(uuid);
    }

    // useEffect(() => {
    //     saveTable();
    // }, [file]);

    return (
        <GlobalStateContext.Provider
            value={{
                cursor,
                cell,
                setCursor,
                table,
                updateTable,
                closeTable,
                removeFromTable,
                saveTable,
                openTable,
                filename,
                setFilename,
                changed,
                inputRef,
                secondaryCursor,
                setSecondaryCursor,
                clipboard,
                setClipboard,
                uuid,
                showFileList,
                setShowFileList,
                handleDelete,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
