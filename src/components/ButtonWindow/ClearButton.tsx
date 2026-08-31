import React, { useState } from "react";
import ClearWindow from "../Window/ClearWindow";

const ClearButton: React.FC = () => {
    const [resetShow, setResetShow] = useState(false);

    return (
        <>
            <div id="clear">
                <button
                    className="btn-circle btn-white"
                    onClick={() => setResetShow(true)}
                >
                    <i className="bi bi-trash-fill sidebar__select"></i>
                </button>
            </div>
            {resetShow && <ClearWindow setShow={setResetShow} />}
        </>
    );
};

export default ClearButton;
