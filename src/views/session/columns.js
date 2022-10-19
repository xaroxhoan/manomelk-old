import { UncontrolledTooltip } from "reactstrap"
import moment from "moment-jalaali"

export const columns = [
  {
    name: "ID",
    selector: row => row._id,
    center: true,
    width: "250px"
  },
  {
    name: "Device",
    cell: (row, index) => (
      <>
        <span
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          id={`deviceName_${index}`}
        >
          {row.deviceName}
        </span>
        <UncontrolledTooltip placement="bottom" target={`deviceName_${index}`}>
          {row.deviceName}
        </UncontrolledTooltip>
      </>
    ),
    center: true,
    width: "400px"
  },
  {
    name: "last ip",
    selector: row => row.lastIp,
    center: true,
    width: "300px"
  },
  {
    name: "last login",
    selector: row => row.createdAt,
    format: row => moment(row?.createdAt).format("HH:mm:ss jYYYY-jM-jD "),
    width: "150px",
    center: true,
    sortable: true,
    sortField: "createdAt"
  }
]
