import React from 'react';
import moment from 'moment';

export default class TimeTHead extends React.Component {
    render() {
        const props = this.props;
        const value = props.value;
        const numColumns = props.numColumns;
        const localeData = value.localeData();
        const prefixCls = props.prefixCls;
        const dayHeadRenderer = props.dayHeadRenderer;
        const veryShortWeekdays = [];
        const weekDays = [];
        const firstDayOfWeek = 0// localeData.firstDayOfWeek();
        let showWeekNumberEl;
        const now = moment();

        for (let dateColIndex = 0; dateColIndex < numColumns; dateColIndex++) {
            const index = (firstDayOfWeek + dateColIndex) % numColumns;
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

        const weekDaysEls = weekDays.map((day, xindex) =>
            <th
                key={xindex}
                role="columnheader"
                title={day}
                className={`${prefixCls}-column-time-header`}
            >
          <span className={`${prefixCls}-column-header-inner`}>
          
              {dayHeadRenderer && dayHeadRenderer(day, xindex) || veryShortWeekdays[xindex]}
               
              
          </span>
            </th>);


        return (<thead>
        <tr role="row">
            {showWeekNumberEl}
            {weekDaysEls}
        </tr>
        </thead>);
    }
}
