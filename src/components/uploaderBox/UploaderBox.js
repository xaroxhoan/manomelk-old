import React from "react"

const UploaderBox = ({ id, onChange }) => {

    const onChangeFiles = (e) => {
        const files = e.target.files
        onChange(files)
    }
    
    return <>
        <input id={`uploader-${id}`} type="file" accept="image/png,image/jpeg" multiple onChange={onChangeFiles} className="hidden" />
        <label htmlFor={`uploader-${id}`} className="upload-box">
            <span className="upload-box-title">+</span>
        </label>
    </>
}

export default UploaderBox