import { useEffect, useState } from 'react'
import { ArrowLeft, Plus } from 'react-feather'
import { Button, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import UploaderEditor from './UploaderEditor'
import UploaderItems from './UploaderItems'
import AsyncSelect from 'react-select/async'
import useService from '../../hooks/service'
import { jwtAxios } from '../../utility/Utils'

const UploaderModal = ({ defaultSelected, onChooseItem }) => {
    const {uploader} = useService()
    const [state, setState] = useState({
        isShowModal: false,
        updateCounter: 0,
        editRow: null,
        selected: null,
        selectedTag: null
    })

    const toggle = () => {
        setState({ ...state, isShowModal: !state.isShowModal, editRow: null })
    }

    const onChoose = row => {
        setState({ ...state, isShowModal: !state.isShowModal, editRow: null, selected: row })
        onChooseItem(row)
    }

    const onEdit = row => {
        setState({ ...state, editRow: row })
    }

    const onSave = _ => {
        setState({ ...state, editRow: null, updateCounter: state.updateCounter + 1 })
    }

    const onClickBackToList = _ => {
        setState({ ...state, editRow: null, updateCounter: state.updateCounter + 1 })
    }

    const onHandleTagChange = item => {
      setState({ 
        ...state,
        selectedTag: item
      })
    }
  
    const loadTags = async (inputValue, callback) => {
      const response = await uploader.tags.fetchAll()
      const options = response.data.data.map(item => {
        return {
          value: item._id,
          label: item.name
        }
      })
      return [{ label: 'All', value: null }, ...options]
    }

    useEffect(() => {
        if (defaultSelected !== undefined && defaultSelected !== null) {
            setState({
                ...state,
                selected: defaultSelected
            })
        }
    }, [defaultSelected])

    return <div className='uploader-modal-wrapper'>
        <Label onClick={toggle}>
            { state.selected === null && <Plus size={16} /> }
            { state.selected !== null && <img src={state.selected.isExternalUrl ? state.selected.file : `${jwtAxios.defaults.baseURL}${state.selected.destination}${state.selected.file}?timestamp=${+new Date()}`} /> }
        </Label>
        <Modal isOpen={state.isShowModal} toggle={toggle} className='modal-dialog-centered modal-fullscreen modal-image-gallery'>
            <ModalHeader toggle={toggle}>
                { state.editRow !== null && <Button color={'transparent'} onClick={onClickBackToList}>
                    <ArrowLeft size={16} />
                </Button> }
                { state.editRow === null && <AsyncSelect
                    className='igw-tags'
                    cacheOptions
                    defaultOptions
                    loadOptions={loadTags}
                    value={state.selectedTag}
                    onChange={onHandleTagChange}
                /> }
            </ModalHeader>
            <ModalBody className={`${state.editRow !== null ? 'uploader-edit-mode' : 'uploader-list-mode'}`}>
                { state.editRow === null && <UploaderItems
                    selectedTag={state.selectedTag}
                    updateCounter={state.updateCounter}
                    onChoose={onChoose}
                    onEdit={onEdit}
                /> }
                { state.editRow !== null && <UploaderEditor
                    selectedRow={state.editRow}
                    onSave={onSave}
                /> }
            </ModalBody>
        </Modal>
    </div>
}
export default UploaderModal