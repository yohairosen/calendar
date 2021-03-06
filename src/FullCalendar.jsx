import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import TimeTable from './time/TimeTable';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import CalendarHeader from './full-calendar/CalendarHeader';

const FullCalendar = createReactClass({
    propTypes: {
        defaultType: PropTypes.string,
        type: PropTypes.string,
        prefixCls: PropTypes.string,
        locale: PropTypes.object,
        onTypeChange: PropTypes.func,
        fullscreen: PropTypes.bool,
        monthCellRender: PropTypes.func,
        dateCellRender: PropTypes.func,
        timeCellRender: PropTypes.func,
        dayHeadRender: PropTypes.func,
        showTypeSwitch: PropTypes.bool,
        Select: PropTypes.func.isRequired,
        headerComponents: PropTypes.array,
        headerComponent: PropTypes.object, // The whole header component
        headerRender: PropTypes.func,
        showHeader: PropTypes.bool,
        disabledDate: PropTypes.func,
        days: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.object)]),
    },
    mixins: [CommonMixin, CalendarMixin],
    getDefaultProps() {
        return {
            defaultType: 'date',
            fullscreen: false,
            showTypeSwitch: true,
            showHeader: true,
            onTypeChange() {
            },
        };
    },
    getInitialState() {
        let type;
        if ('type' in this.props) {
            type = this.props.type;
        } else {
            type = this.props.defaultType;
        }
        return {
            type,
        };
    },
    componentWillReceiveProps(nextProps) {
        if ('type' in nextProps) {
            this.setState({
                type: nextProps.type,
            });
        }
    },
    onMonthSelect(value) {
        this.onSelect(value, {
            target: 'month',
        });
    },
    setType(type) {
        if (!('type' in this.props)) {
            this.setState({
                type,
            });
        }
        this.props.onTypeChange(type);
    },
    render() {
        const props = this.props;
        const {
            locale,
            prefixCls,
            fullscreen,
            showHeader,
            headerComponent,
            headerRender,
            disabledDate,
            days
        } = props;
        const {value, type} = this.state;
console.log(days)
        let header = null;
        if (showHeader) {
            if (headerRender) {
                header = headerRender(value, type, locale);
            } else {
                const TheHeader = headerComponent || CalendarHeader;
                header = (
                    <TheHeader
                        key="calendar-header"
                        {...props}
                        prefixCls={`${prefixCls}-full`}
                        type={type}
                        value={value}
                        onTypeChange={this.setType}
                        onValueChange={this.setValue}
                    />
                );
            }
        }


        let table
        if (type === 'date') {
            table = (
                <DateTable
                    dateRender={props.dateCellRender}
                    contentRender={props.dateCellContentRender}
                    locale={locale}
                    prefixCls={prefixCls}
                    onSelect={this.onSelect}
                    value={value}
                    disabledDate={disabledDate}
                />)
        }
        else if (type === 'month') {
            table = (
                <MonthTable
                    cellRender={props.monthCellRender}
                    contentRender={props.monthCellContentRender}
                    locale={locale}
                    onSelect={this.onMonthSelect}
                    prefixCls={`${prefixCls}-month-panel`}
                    value={value}
                    disabledDate={disabledDate}
                />)

        }
        else if (type === 'day' || type === 'week' || type === 'time') {
            table = (
                <TimeTable
                    timeRender={props.timeCellRender}
                    contentRender={props.dateCellContentRender}
                    locale={locale}
                    prefixCls={prefixCls}
                    onSelect={this.onSelect}
                    value={value}
                    disabledDate={disabledDate}
                    days={days || (type === 'week' ? 7 : 1)}
                    dayHeadRender={props.dayHeadRender}
                />)
        }

        const children = [
            header,
            (<div key="calendar-body" className={`${prefixCls}-calendar-body`}>
                {table}
            </div>),
        ];


        const className = [`${prefixCls}-full`];

        if (fullscreen) {
            className.push(`${prefixCls}-fullscreen`);
        }

        return this.renderRoot({
            children,
            className: className.join(' '),
        });
    },
});

export default FullCalendar;
