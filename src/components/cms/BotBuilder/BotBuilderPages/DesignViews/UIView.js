import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Col, Row as _Row } from 'react-flexbox-grid';
import CircularLoader from '../../../../shared/CircularLoader';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../../redux/actions/ui';
import createActions from '../../../../../redux/actions/create';
import _Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { urls, colors } from '../../../../../utils';
import avatars from '../../../../../utils/avatars';
import ColorPickerComponent from '../../../../shared/ColorPickerComponent';
import _Check from '@material-ui/icons/Check';
import styled from 'styled-components';
let BASE_URL = urls.API_URL;
let IMAGE_GET_URL = `${BASE_URL}/cms/getImage.png?image=`;

const BotAvatarImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AvatarUploadButton = styled.label`
  border-radius: 50%;
  height: 60px;
  width: 60px;
  background-color: #eee;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: 10px;
`;

const DesignContainer = styled.div`
  max-width: 100%;
  text-align: left;

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

const FileUploadButton = styled.label`
  display: inline-block;
  font-family: sans-serif;
  cursor: pointer;
  text-decoration: none;
  padding: 0px 10px;
  position: relative;
  z-index: 1;
  line-height: 36px;
  border-radius: 2px;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  background-color: rgb(66, 133, 244);
  text-align: center;
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  max-width: 200px;
  min-width: 88px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;

  &:hover {
    background-color: rgb(90, 147, 241);
  }
`;

const Close = styled(_Close)`
  vertical-align: middle;
  margin-left: 20px;
  cursor: pointer;
`;

const ToggleLabel = styled.label`
  margin-right: 10px;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: inline-block;
`;

const Row = styled(_Row)`
  margin-bottom: 15px;
`;

const ComponentName = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

const BotBuilderContainer = styled.div`
  padding: 10px 0 25px 0;
`;

const AddIcon = styled(Add)`
  height: 30px;
  margin-top: 15px;
  color: rgb(66, 133, 245);
`;

const Input = styled.input`
  display: none;
`;

const Check = styled(_Check)`
  display: none;
  position: absolute;
  top: -9px;
  right: 0px;
  font-size: 23px;
  color: #4285f5;
`;

const IconWrap = styled.span`
  display: inline-block;
  position: relative;
  ${BotAvatarImg} {
    border: ${props => (props.icon ? 'solid 2px #4285f5' : 'none')};
  }

  ${Check} {
    display: ${props => (props.icon ? 'block' : 'none')};
  }
`;

// Custom Theme feature Component
const customiseOptionsList = [
  {
    id: 1,
    component: 'botbuilderBackgroundBody',
    name: 'Change background',
  },
  {
    id: 2,
    component: 'botbuilderUserMessageBackground',
    name: 'User message bubble',
  },
  {
    id: 3,
    component: 'botbuilderUserMessageTextColor',
    name: 'User message text',
  },
  {
    id: 4,
    component: 'botbuilderBotMessageBackground',
    name: 'Bot message bubble',
  },
  {
    id: 5,
    component: 'botbuilderBotMessageTextColor',
    name: 'Bot message text',
  },
  {
    id: 6,
    component: 'botbuilderIconColor',
    name: 'Avatar background',
  },
  {
    id: 7,
    component: 'botbuilderAvatar',
    name: 'Choose your bot avatar',
  },
];

class UIView extends Component {
  constructor(props) {
    super(props);
    let avatarsIcons = avatars.slice();
    this.state = {
      loadedSettings: false,
      uploadingBodyBackgroundImg: false,
      botbuilderBodyBackgroundImgName: '',
      uploadingBotbuilderIconImg: false,
      avatars: avatarsIcons,
      originalAvatarsCount: avatarsIcons.length,
      showBackgroundImageChange: false,
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  handleChangeColor = (component, color) => {
    if (color) {
      const { actions } = this.props;
      if (!color.startsWith('#')) {
        color = '#' + color;
      }
      actions.setDesignComponentColor({ component, color });
    }
  };

  handleChangeBodyBackgroundImage = botbuilderBodyBackgroundImg => {
    let files = botbuilderBodyBackgroundImg.target.files;
    if (files.length === 0) {
      this.handleRemoveUrlBody();
    } else {
      this.uploadImageBodyBackground(files[0]);
    }
  };

  uploadImageBodyBackground = file => {
    const { actions, accessToken } = this.props;
    let form = new FormData();
    form.append('image', file);
    form.append('access_token', accessToken);
    form.append('image_name', file.name);
    this.setState({ uploadingBodyBackgroundImg: true });
    actions
      .setBotBackgroundImage(form)
      .then(payload => {
        this.setState({
          uploadingBodyBackgroundImg: false,
        });
      })
      .catch(error => {
        this.setState({
          uploadingBodyBackgroundImg: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error! Couldn't upload image",
          snackBarDuration: 2000,
        });
      });
  };

  uploadImageIcon = file => {
    const { actions, accessToken } = this.props;
    let form = new FormData();
    form.append('access_token', accessToken);
    form.append('image_name', file.name);
    form.append('image', file);
    actions
      .setBotAvatar(form)
      .then(payload => {
        let imgUrl = IMAGE_GET_URL + payload.imagePath;
        let avatarsObj = this.state.avatars;
        let imgObj = {
          id: avatarsObj.length,
          url: imgUrl,
        };
        this.handleIconSelect(imgObj);
        avatarsObj.push(imgObj);
        this.setState({
          avatars: avatarsObj,
          uploadingBotbuilderIconImg: false,
        });
      })
      .catch(error => {
        this.setState({
          uploadingBotbuilderIconImg: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error! Couldn't upload image",
          snackBarDuration: 2000,
        });
      });
  };

  handleRemoveUrlBody = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    code = code.replace(
      /^::bodyBackgroundImage\s(.*)$/m,
      '::bodyBackgroundImage ',
    );
    actions.updateDesignData({
      code,
      botbuilderBodyBackgroundImg: '',
      botbuilderBodyBackgroundImgName: '',
    });
  };

  handleChangeIconImage = botbuilderIconImg => {
    botbuilderIconImg.persist();
    let files = botbuilderIconImg.target.files;
    if (files.length === 0) {
      this.handleRemoveUrlIcon();
    } else {
      this.uploadImageIcon(files[0]);
    }
  };

  handleRemoveUrlIcon = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    code = code.replace(/^::botIconImage\s(.*)$/m, '::botIconImage ');
    actions.updateDesignData({
      code,
      botbuilderIconImg: '',
    });
    this.setState({
      iconSelected: null,
    });
  };

  getSettings = () => {
    const { code } = this.props.design;
    const botIconImageMatch = code.match(/^::botIconImage\s(.*)$/m);

    if (botIconImageMatch && botIconImageMatch[1].length > 0) {
      let avatarsObj = this.state.avatars;
      avatarsObj.push({
        id: avatarsObj.length,
        url: botIconImageMatch[1],
      });
      for (let icon of avatarsObj) {
        if (icon.url === botIconImageMatch[1]) {
          this.handleIconSelect(icon);
          break;
        }
      }
      this.setState({
        avatars: avatarsObj,
      });
    }

    this.setState({
      loadedSettings: true,
    });
  };

  handleReset = () => {
    // reset to default values
    const { actions } = this.props;
    this.setState({ loadedSettings: false });
    let avatarsIcons = this.state.avatars.slice(
      0,
      this.state.originalAvatarsCount,
    );
    actions.resetDesignData().then(() => {
      this.setState({
        loadedSettings: true,
        iconSelected: 0,
        avatars: avatarsIcons,
      });
    });
  };

  handleIconSelect = icon => {
    let {
      actions,
      design: { code },
    } = this.props;
    if (icon.id === this.state.iconSelected) {
      code = code.replace(/^::botIconImage\s(.*)$/m, '::botIconImage ');
      actions.updateDesignData({ code, botbuilderIconImg: '' });
      this.setState({
        iconSelected: null,
      });
    } else {
      code = code.replace(
        /^::botIconImage\s(.*)$/m,
        `::botIconImage ${icon.url}`,
      );
      actions.updateDesignData({ code, botbuilderIconImg: icon.url });
      this.setState({
        iconSelected: icon.id,
      });
    }
  };

  handleClickColorBox = id => {
    document.getElementById(`colorPicker${id}`).click();
  };

  handleShowBackgroundImageChangeToggle = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    let isInputChecked = !this.state.showBackgroundImageChange;
    if (isInputChecked === false) {
      code = code.replace(
        /^::bodyBackgroundImage\s(.*)$/m,
        '::bodyBackgroundImage ',
      );
      actions.updateDesignData({
        code,
        botbuilderBodyBackgroundImg: '',
      });
    }
    this.setState({ showBackgroundImageChange: isInputChecked });
  };

  render() {
    const customizeComponents = customiseOptionsList.map(component => {
      return (
        <div key={component.id} className="circleChoose">
          <Row>
            <Col xs={12} md={6} lg={6}>
              {component.id === 7 ? (
                <ColumnContainer>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '400',
                    }}
                  >
                    {component.name}
                  </div>
                </ColumnContainer>
              ) : (
                <ColumnContainer>
                  <ComponentName>{component.name}</ComponentName>
                  {component.id === 1 && (
                    <div>
                      <ToggleLabel
                        onClick={this.handleShowBackgroundImageChangeToggle}
                      >
                        Color
                      </ToggleLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.showBackgroundImageChange}
                            onChange={
                              this.handleShowBackgroundImageChangeToggle
                            }
                            color="primary"
                          />
                        }
                        label="Image"
                      />
                    </div>
                  )}
                </ColumnContainer>
              )}
            </Col>
            <Col xs={12} md={6} lg={6}>
              {component.id !== 7 &&
              !(
                component.id === 1 &&
                this.state.showBackgroundImageChange === true
              ) ? (
                <RowContainer>
                  <ColorPickerComponent
                    component={component.component}
                    id={component.id}
                    handleChangeColor={this.handleChangeColor}
                    backgroundColor={this.props.design[component.component]}
                    handleClickColorBox={this.handleClickColorBox}
                  />
                </RowContainer>
              ) : null}
              {component.component === 'botbuilderBackgroundBody' &&
                this.state.showBackgroundImageChange === true && (
                  <div>
                    <br />
                    <Form>
                      <FileUploadButton title="Upload Background Image">
                        <Input
                          disabled={this.state.uploadingBodyBackgroundImg}
                          type="file"
                          onChange={this.handleChangeBodyBackgroundImage}
                          accept="image/*"
                        />
                        {this.state.uploadingBodyBackgroundImg ? (
                          <CircularLoader color="#ffffff" size={32} />
                        ) : (
                          'Upload Image'
                        )}
                      </FileUploadButton>
                    </Form>
                    {this.state.botbuilderBodyBackgroundImg && (
                      <RowContainer>
                        <h3>{this.state.botbuilderBodyBackgroundImgName}</h3>
                        <span title="Remove image">
                          <Close onClick={this.handleRemoveUrlBody} />
                        </span>
                      </RowContainer>
                    )}
                  </div>
                )}
            </Col>
          </Row>
          {component.component === 'botbuilderAvatar' && (
            <BotBuilderContainer>
              {this.state.avatars.map(icon => {
                return (
                  <IconWrap
                    id={icon.id}
                    key={icon.id}
                    icon={this.state.iconSelected === icon.id}
                  >
                    <BotAvatarImg
                      alt="icon"
                      src={icon.url}
                      onClick={() => this.handleIconSelect(icon)}
                    />
                    <Check />
                  </IconWrap>
                );
              })}
              <Form>
                <AvatarUploadButton title="Upload your own bot icon">
                  <Input
                    disabled={this.state.uploadingBotbuilderIconImg}
                    type="file"
                    onChange={
                      this.state.uploadingBotbuilderIconImg
                        ? null
                        : this.handleChangeIconImage
                    }
                    accept="image/x-png,image/gif,image/jpeg"
                  />
                  {this.state.uploadingBotbuilderIconImg ? (
                    <CircularLoader size={30} />
                  ) : (
                    <AddIcon />
                  )}
                </AvatarUploadButton>
              </Form>
            </BotBuilderContainer>
          )}
        </div>
      );
    });
    return (
      <div>
        {!this.state.loadedSettings ? (
          <CircularLoader />
        ) : (
          <DesignContainer>
            {this.state.loadedSettings && <Grid>{customizeComponents}</Grid>}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
            >
              {this.state.resetting ? (
                <CircularLoader color={colors.light.header} size={32} />
              ) : (
                'Reset Changes'
              )}
            </Button>
          </DesignContainer>
        )}
      </div>
    );
  }
}

UIView.propTypes = {
  actions: PropTypes.object,
  code: PropTypes.string,
  accessToken: PropTypes.string,
  design: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
    design: store.create.design,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...createActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UIView);
