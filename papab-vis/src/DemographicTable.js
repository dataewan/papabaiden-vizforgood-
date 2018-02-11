import React from 'react';
import * as _ from 'lodash';
import DemographicConfig from './DemographicConfig'

import './DemographicTable.css';

const sortorders = {
  DESC: 'desc',
  ASC: 'asc'
}

class DemographicTable extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      sortorder: sortorders.DESC
    }

  }

  togglesort(){
    const neworder = this.state.sortorder === sortorders.DESC ? sortorders.ASC : sortorders.DESC
    this.setState({
      sortorder: neworder
    })
  }

  sortordericon(){
    return this.state.sortorder === sortorders.DESC ? '⬇' : '⬆'
  }

  render() {
    const { selected, data, change, selectedVariable, codelookup } = this.props;
    const conf = DemographicConfig[selectedVariable];
    const values = _(data)
      .orderBy(d => d.data.demographics[selectedVariable], this.state.sortorder)
      .map(
      (d,i) => <tr
        key={`row${i}`}
        onClick={e => this.props.change(d.code)}
        className={d.code === selected ? 'selected' : 'unselected'}
      >
        <td>{codelookup[d.code]}</td>
        <td>{conf.formatter(d.data.demographics[selectedVariable])}</td>
      </tr>
      )
      .value()
    return (
      <div className='demographictable'>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th
                onClick={e => this.togglesort()}
              >{`${conf.pretty} ${this.sortordericon()}`}</th>
            </tr>
          </thead>
          <tbody>
            {values}
          </tbody>
        </table>
      </div>

    );
  }
}

export default DemographicTable;
