
import React from 'react';
import TimeTHead from './TimeTHead';
import TimeTBody from './TimeTBody';

export default
class DateTable extends React.Component {
  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    return (<table className = {`${prefixCls}-table`} cellSpacing="0" role="grid">
      <TimeTHead {...props}/>
      <TimeTBody {...props}/>
    </table>);
  }
}
