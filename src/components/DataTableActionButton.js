import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { Download, Edit, List, MoreVertical, Upload } from 'react-feather'

const DataTableActionButton = () => {
    return (
        <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem href={ '#' } onClick={ e => {} }>
                    <Upload className='me-50' size={15} /> <span className='align-middle'>Export</span>
                </DropdownItem>
                <DropdownItem href={ '#' } onClick={ e => {} }>
                    <Download className='me-50' size={15} /> <span className='align-middle'>Import</span>
                </DropdownItem>
                <DropdownItem href={ '#' } onClick={ e => {} }>
                    <List className='me-50' size={15} /> <span className='align-middle'>View Logs</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default DataTableActionButton