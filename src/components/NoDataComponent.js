import { Table } from "reactstrap"

const NoDataComponent = ({ columns }) => {
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
                        <div className="datatable-loading">رکوردی برای نمایش وجود ندارد</div>
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

export default NoDataComponent