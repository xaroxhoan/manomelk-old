import React, { useState } from "react"

const UploaderItem = ({ src, index, onRemove, onSetMainImage }) => {
    const [state, setState] = useState({
        isShowModal: false
    })

    const onClickClose = () => {
        setState({
            isShowModal: false
        })
    }

    const onClickRemove = () => {
        onRemove(index)
        onClickClose()
    }

    const onClickSetMainImage = () => {
        onSetMainImage(index)
        onClickClose()
    }

    return <>
        <div onClick={() => setState({ ...state, isShowModal: true })} className="upload-box">
            <div className="upload-box-image">
                <img src={src} alt="" />
                {index === 0 && <span className="upload-box-main">تصویر اصلی</span>}
            </div>
        </div>
        {state.isShowModal === true && <div className="auth-form-wrapper" id="auth-form-wrapper">
            <div className="upload-modal">
                <div>
                    <ul>
                        <li onClick={onClickRemove}>
                            <span>حذف تصویر</span>
                        </li>
                        <li onClick={onClickSetMainImage}>
                            <span>تنظیم به عنوان تصویر اصلی</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>}
    </>
}

export default UploaderItem