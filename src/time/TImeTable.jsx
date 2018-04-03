import React from 'react';
import TimeTHead from './TimeTHead';
import TimeTBody from './TimeTBody';
import DateConstants from "./TimeConstants";

export default class TimeTable extends React.Component {
    render() {
        const props = this.props;

        const days = props.days;
        const prefixCls = props.prefixCls;
        console.log(days)
        const numColumns = Array.isArray(days) ? days.length : (days || DateConstants.WEEK_DAYS_COUNT);


        return (<table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
            <TimeTHead {...props} numColumns={numColumns}/>
            <TimeTBody {...props} numColumns={numColumns}/>
        </table>);
    }
}
