import { ChevronDown, ChevronRight, Edit, MoreVertical, Plus, Trash } from 'react-feather'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

const CategoriesCollapseItem = ({ item, openedCollapses, onClickUpdate, onAddNew, onEditRow, onToggleCollapse, canAddChild }) => {
    return <div className='categories-parent-wrapper'>
    { (item.children !== null && item.children.length > 0) && <Button.Ripple className='btn-icon btn-toggle-collapse' color='flat-primary' onClick={_ => onToggleCollapse(item)}>
      { (openedCollapses.indexOf(item._id) < 0) && <ChevronRight size={16} /> }
      { (openedCollapses.indexOf(item._id) > -1) && <ChevronDown size={16} /> }
    </Button.Ripple> }
    <Button color="flat-secondary" onClick={() => onClickUpdate(item)}>{item.title}</Button>
    { canAddChild && <Button.Ripple className='btn-icon' color='flat-primary' onClick={ _ => onAddNew(item)}>
      <Plus size={16} />
    </Button.Ripple> }
    <UncontrolledDropdown>
      <DropdownToggle className='icon-btn hide-arrow' color='flat-primary' size='sm' caret>
          <MoreVertical size={15} />
      </DropdownToggle>
      <DropdownMenu>
          <DropdownItem href={ '#' } onClick={ e => onEditRow(e, item)}>
            <Edit className='me-50' size={15} /> <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem href='/' onClick={ (e) => {} }>
            <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
          </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </div>
}

export default CategoriesCollapseItem