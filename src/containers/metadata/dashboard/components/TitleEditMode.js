import React, { Component } from 'react';

class TitleEditMode extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AvForm id="titleDetail" onValidSubmit={this.onSave} ref={c => (this.form = c)}>
                <Container fluid>
                    <Row>
                        <Col className="clearfix">
                            <Button className="float-right" id="btnSave" color="primary">Save</Button>
                            <Button className="float-right" id="btnCancel" onClick={this.handleCancel} outline color="danger" style={{ marginRight: '10px' }}>Cancel</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4">
                            <img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Slide" />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Label for="title">Title<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="title" errorMessage="Field can not be empty!" id="title" value={title} required placeholder="Enter Title" onChange={this.handleOnChange} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Label for="titleContentType">Content Type<span style={{ color: 'red' }}>*</span></Label>                                 
                                    {/*<AvField 
                                        type="select"
                                        id="titleContentType"
                                        name="contentType"
                                        required
                                        defaultValue={'Movie'}
                                        onChange={this.handleSelect}
                                        errorMessage="Field can not be empty!">
                                        <option value={''}>Select Content Type</option>
                                        <option value="Movie">Movie</option>
                                        <option value="Brand">Brand</option>
                                        <option value="Episode">Episode</option>
                                        <option value="Season">Season</option>
                                        <option value="Event">Event</option>
                                    </AvField>*/}                                    
                                    <select
                                        id="titleContentType"
                                        name="contentType"
                                        defaultValue={'Movie'}
                                        onChange={this.handleSelect}>
                                        <option value={''}>Select Content Type</option>
                                        <option value="Movie">Movie</option>
                                        <option value="Brand">Brand</option>
                                        <option value="Episode">Episode</option>
                                        <option value="Season">Season</option>
                                        <option value="Event">Event</option>
                                    </select>   
                                </Col>
                                <Col>
                                    <Label for="titleProductionStudio">Production Studio<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="productionStudioId" errorMessage="Field can not be empty!" id="titleProductionStudio" value={productionStudioId} required placeholder="Enter Studio" onChange={this.handleOnChange} />
                                </Col>
                            </Row>
                            {
                                !this.state.brandChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleBrandName">Brand <span style={{ color: 'red' }}>*</span></Label>
                                            <AvField type="text" name="brandTitleName" value={brandTitleName} id="titleBrandName" placeholder={'Enter Brand Name'} errorMessage="Field can not be empty!"
                                                //required
                                                onChange={this.handleChangeEpisodic}
                                            />
                                        </Col>
                                        <Col>
                                            <Label for="titleBrandProductionYear">Brand Production Year <span style={{ color: 'red' }}>*</span></Label>
                                            <AvField name="brandProdYear" id="titleBrandProductionYear" errorMessage="Please enter a valid year!" validate={{
                                                //required: { errorMessage: 'Field cannot be empty!' },
                                                pattern: { value: '^[0-9]+$' },
                                                minLength: { value: 4 },
                                                maxLength: { value: 4 }
                                            }} placeholder="Enter Brand Production Year" value={brandProdYear} onChange={this.handleChangeEpisodic} />
                                        </Col>
                                    </Row>
                                    : null
                            }
                            {
                                !this.state.seasonChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleSeasonNumber">Season <span style={{ color: 'red' }}>*</span></Label>
                                            <AvField type="text" name="seasonNumber" value={seasonNumber} id="titleSeasonNumber" placeholder={'Enter Season Number'} errorMessage="Field can not be empty!"
                                                required
                                                onChange={this.handleChangeEpisodic}
                                            />
                                        </Col>
                                        {
                                            !this.state.episodeChecked ?
                                                <Col>
                                                    <Label for="titleEpisodeNumber">Episode</Label>
                                                    <Input type="text" name="episodeNumber" value={episodeNumber} id="titleEpisodeNumber" placeholder={'Enter Episode Number'} onChange={this.handleChangeEpisodic} />
                                                </Col>
                                                : null
                                        }
                                    </Row>
                                    : null
                            }
                            {
                                !this.state.seasonChecked ?
                                    <Row>
                                        <Col>
                                            <Label for="titleSeasonID">Season ID</Label>
                                            <Input type="text" name="seasonId" value={seasonId} id="titleSeasonID" placeholder={'Enter Season ID'} onChange={this.handleChangeEpisodic} />
                                        </Col>
                                        {
                                            !this.state.episodeChecked ?
                                                <Col>
                                                    <Label for="titleEpisodeID">Episode ID</Label>
                                                    <Input type="text" name="episodeId" value={episodeId} id="titleEpisodeID" placeholder={'Enter Episode ID'} onChange={this.handleChangeEpisodic} />
                                                </Col>
                                                : null
                                        }
                                    </Row>
                                    : null
                            }
                            <Row style={{ marginTop: '15px' }}>
                                <Col>
                                    <Label for="titleProductionYear">Production Year<span style={{ color: 'red' }}>*</span></Label>
                                    <AvField name="productionYear" errorMessage="Please enter a valid year!" id="titleProductionYear" validate={{
                                        required: { value: true, errorMessage: 'Field cannot be empty!' },
                                        pattern: { value: '^[0-9]+$' },
                                        minLength: { value: 4 },
                                        maxLength: { value: 4 }
                                    }} placeholder="Enter Production Year" value={productionYear} onChange={this.handleOnChange} />
                                </Col>
                                <Col>
                                    <Label for="titleBoxOffice">Box Office</Label>
                                    <AvField name="boxOffice" id="titleBoxOffice" type="text" value={boxOffice} placeholder="Enter Box Office" validate={{
                                        pattern: { value: '^[0-9]+$', errorMessage: 'Please enter a number!' },
                                    }} onChange={this.handleOnChange} />
                                </Col>
                            </Row>
                            {
                                this.state.loading ?
                                    <Progress striped color="success" value="100">Updating...</Progress>
                                    : null
                            }
                        </Col>
                    </Row>
                </Container>
            </AvForm>
        )
    }
}

export default TitleEditMode;