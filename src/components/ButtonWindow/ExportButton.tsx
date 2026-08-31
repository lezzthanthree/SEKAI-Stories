import React, { useState } from "react";
import ExportWindow from "../Window/ExportWindow";

const ExportButton: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <>
            <div id="export">
                <button
                    className="btn-circle btn-white"
                    onClick={() => setShow(true)}
                >
                    <i className="bi bi-braces sidebar__select"></i>
                </button>
            </div>
            {show && <ExportWindow setShow={setShow} />}
        </>
    );
};

export default ExportButton;
