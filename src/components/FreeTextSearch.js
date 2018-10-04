import React from 'react'

export default class FreeTextSearch extends React.Component {

  render() {
    return (<div className="input-group stylish-input-group">
          <input type="text" className="form-control" placeholder="Search" id={this.props.containerId + '-freetext-search-text'}/>

        <div className="input-group-append">
            <button type="button" className="btn" id={this.props.containerId + '-freetext-search-btn'}>
                <i className="fas fa-search"> </i>
            </button>
            {/*<span className="input-group-text" id="basic-addon">.00</span>*/}
        </div>
        </div>)
  }
}
