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
            <th key={column.id}>{column.name}</th>
          ))}
        </tr>
        {
          data && data.map(item => (
            <tr className="table-data-row cursor-pointer" onClick={() => selectItem(item.id)} key={Math.random()*1000}>
              <td>
                {item.title}
              </td>
              <td>{item.description.length > 35 ? `${item.description.substring(0, 35)}...` : item.description}</td>
              <td>{moment(item.created_at).format('MMM D, YYYY')}</td>
              <td><span className={`status-${item.status} p-1 text-small border-radius-default`}>{item.status}</span></td>
            </tr>
          ))
        }
         <tr>
           <td className="text-center text-small" colSpan={columns && columns.length}>
            Showing <b>{data && data.length} of {info && info.total} tickets</b>
           </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataTable;