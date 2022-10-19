import { Spinner, Table } from "reactstrap"

const CustomLoader = ({ columns }) => {
    return (
        <Table className="table-loading">
            <thead>
                <tr className="rdt_TableHeadRow">
                    {columns.map(column => <td key={column.name} className="rdt_TableCol">{column.name}</td>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={30}>
                        <div className="datatable-loading">
                            <Spinner color='primary' />
                        </div>
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

export default CustomLoader