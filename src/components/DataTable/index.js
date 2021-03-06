import React from 'react';
import moment from 'moment';
import './style.scss';

const DataTable = (props) => {
  const { columns, data, info, selectItem } = props

  return (
    <div className="data-table">
      <table>
        <tbody>
        <tr className="table-header">
          {columns && columns.map(column => (
            <th key={column.id}>{column.name.toUpperCase()}</th>
          ))}
        </tr>
        {
          data && data.map(item => (
            <tr className="table-data-row cursor-pointer" onClick={() => selectItem(item.id)} key={Math.random()*1000}>
              <td>
                {item.title}
              </td>
              <td> <span className='description'> {item.description.length > 35 ? `${item.description.substring(0, 35)}...` : item.description}</span></td>
              <td>{moment(moment(item.created_at).toDate()).format('MMM D, YYYY')}</td>
              <td><span className={`status-${item.status} p-1 text-small px-3 text-center d-block`}>{item.status}</span></td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  )
}

export default DataTable;