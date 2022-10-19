import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Collapse, Row, Col } from 'reactstrap'
import useService from '../../hooks/service'
import CategoriesCollapseItem from './CategoriesCollapseItem'

const CategoriesDataTable = ({ onClickUpdate, onAddNew }) => {
  const {articleCategories} = useService()
  const [pending, setPending] = useState(true)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [openedCollapses, setOpenedCollapses] = useState([])
  const history = useHistory()

  const fetchData = async () => {
    try {
      setPending(true)
      const response = await articleCategories.fetchList()
      setItems(response.data.data === null ? [] : response.data.data)
      setPending(false)
    } catch (e) {}
  }

  useEffect(async () => {
    await fetchData()
  }, [])

  const onClickDelete = (e, item) => {
    e.preventDefault()
    setSelectedItem(item)
  }

  const onDelete = async () => {
    try {
      await articleCategories.delete(selectedItem._id)
      setSelectedItem(null)
      await fetchData()
    } catch (e) {}
  }

  const onClickEdit = (e, endpointUrl) => {
    e.preventDefault()
    history.push(endpointUrl)
  }

  const toggleCollapse = item => {
    const index = openedCollapses.indexOf(item._id)
    if (index > -1) {
      const newOpenedCollapses = [...openedCollapses]
      newOpenedCollapses.splice(index, 1)
      setOpenedCollapses([...newOpenedCollapses])
    } else {
      setOpenedCollapses([...openedCollapses, item._id])
    }
  }

  const onEditRow = (e, row) => {
    e.preventDefault()
    onClickUpdate(row)
  }

  return (
    <Row className='categories-wrapper'>
      <Col lg={12} sm={12}>
        {items.map(item => <div key={item._id}>
          <CategoriesCollapseItem 
            item={item}
            openedCollapses={openedCollapses}
            onClickUpdate={onClickUpdate}
            onAddNew={onAddNew}
            onToggleCollapse={toggleCollapse}
            canAddChild={true}
            onEditRow={onEditRow}
          />
          {(item.children !== null && item.children.length > 0) && <Collapse isOpen={openedCollapses.indexOf(item._id) > -1}>
            {item.children.map(childrenLevel1 => <div key={childrenLevel1._id}>
              <CategoriesCollapseItem 
                item={childrenLevel1}
                openedCollapses={openedCollapses}
                onClickUpdate={onClickUpdate}
                onAddNew={onAddNew}
                onToggleCollapse={toggleCollapse}
                canAddChild={true}
                onEditRow={onEditRow}
              />
              {(childrenLevel1.children !== null && childrenLevel1.children.length > 0) && <Collapse isOpen={openedCollapses.indexOf(childrenLevel1._id) > -1}>
                {childrenLevel1.children.map(childrenLevel2 => <div key={childrenLevel2._id}>
                  <CategoriesCollapseItem 
                    item={childrenLevel2}
                    openedCollapses={openedCollapses}
                    onClickUpdate={onClickUpdate}
                    onAddNew={onAddNew}
                    onToggleCollapse={toggleCollapse}
                    canAddChild={false}
                    onEditRow={onEditRow}
                  />
                </div>)}
              </Collapse>}
            </div>)}
          </Collapse>}
        </div>)}
        { (!pending && items.length <= 0) && <div className='no-records'>No Records Found</div> }
      </Col>
    </Row>
  )
}

export default CategoriesDataTable