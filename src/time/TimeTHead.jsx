import React from 'react';
import moment from 'moment';

export default class TimeTHead extends React.Component {
    render() {
        const props = this.props;
        const value = props.value;
        const numColumns = props.numColumns;
        const localeData = value.localeData();
        const prefixCls = props.prefixCls;
        const dayHeadRender = props.dayHeadRender;
        const veryShortWeekdays = [];
        const weekDays = [];
        const firstDayOfWeek = localeData.firstDayOfWeek();
        // console.log('first ' + firstDayOfWeek)
        let showWeekNumberEl;
        const now = moment();
        const days = this.props.days;

        let getNextDay = index => {

            this.getNextDay = Array.isArray(days)  ?
                index => days[index].day() :
                index => (firstDayOfWeek + index) % numColumns;


            return this.getNextDay(index)
        }

        for (let dateColIndex = 0; dateColIndex < numColumns; dateColIndex++) {
            const index = getNextDay(dateColIndex);
            now.day(index);
            veryShortWeekdays[dateColIndex] = localeData.weekdaysMin(now);
            weekDays[dateColIndex] = localeData.weekdaysShort(now);
        }

        if (props.showWeekNumber) {
            showWeekNumberEl = (
                <th
                    role="columnheader"
                    className={`${prefixCls}-column-time-header ${prefixCls}-week-number-header`}
                >
                    <span className={`${prefixCls}-column-header-inner`}>x</span>
                </th>);
        }

        const headerEls = weekDays.map((day, xindex) =>
            <th
                key={xindex}
                role="columnheader"
                title={day}
                className={`${prefixCls}-column-time-header`}
            >
          <span className={`${prefixCls}-column-header-inner`}>
          
              {dayHeadRender && dayHeadRender(day, xindex) || veryShortWeekdays[xindex]}
               
              
          </span>
            </th>);


        return (<thead>
        <tr role="row">
            {showWeekNumberEl}
            {headerEls}
        </tr>
        </thead>);
    }
}
