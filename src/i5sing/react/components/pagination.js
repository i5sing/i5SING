/**
 * 分页组件
 * Example:
 * <Pagination current={} count={} pageSize={} onChange={}/>
 *
 * current: 当前页数
 * count: 总条数
 * pageSize: 每页条数
 * onChange: 翻页回调
 *
 * Created by zhaofeng on 7/13/16.
 */
import React from 'react';

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange(page) {
        if (page == this.props.page) return;

        this.setState({current: page});
        this.props.onChange && this.props.onChange(page);
    }

    render() {
        let count = this.props.count || 0,
            current = this.props.page || 1,
            size = this.props.size || 10,
            pageSize = this.props.pageSize || 20;

        let tempPageNumber = count / pageSize,
            endPage = parseInt(count / pageSize);

        endPage = tempPageNumber > endPage ? endPage + 1 : endPage;

        let pages = [],
            page1 = current,
            page2 = current + 1;

        while (pages.length < parseInt(size / 2) && page1 > 0) {
            pages.unshift(page1--);
        }

        while (pages.length < size && page2 <= endPage) {
            pages.push(page2++);
        }

        return (
            <div className="elsa-pagination">
                <ul>
                    <li className={`pointer ${current == 1 ? 'active' : ''}`}
                        onClick={this.onChange.bind(this, 1)}
                        key="start">首页
                    </li>
                    {current !== 1 &&
                    <li className="pointer"
                        onClick={this.onChange.bind(this, current - 1)}
                        key="previous">上一页
                    </li>
                    }
                    {pages.map((page, index) => {
                        {
                            return (
                                <li className={`pointer ${current == page ? 'active' : ''}`}
                                    onClick={this.onChange.bind(this, page)}
                                    key={page + index}>{page}
                                </li>
                            )
                        }
                    })}
                    {current !== endPage &&
                    <li className="pointer"
                        onClick={this.onChange.bind(this, current + 1)}
                        key="next">下一页
                    </li>
                    }
                    <li className={`pointer ${current == endPage ? 'active' : ''}`}
                        onClick={this.onChange.bind(this, endPage)}
                        key="end">末页
                    </li>
                </ul>
            </div>
        );
    }
}