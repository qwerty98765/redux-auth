import React from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from "react-bootstrap";
import ButtonLoader from "../ButtonLoader";
import Input from "../Input";
import { connect } from "react-redux";
import { hidePasswordResetSuccessModal } from "../../../actions/ui";
import {
  updatePasswordModal,
  updatePasswordModalFormUpdate
} from "../../../actions/update-password-modal";

class PasswordResetSuccessModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    inputProps: PropTypes.object
  };

  static defaultProps = {
    show: false,
    inputProps: {}
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(updatePasswordModalFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit () {
    let formData = this.props.auth.getIn(["updatePasswordModal", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(updatePasswordModal(formData, this.getEndpoint()));
  }

  close () {
    this.props.dispatch(hidePasswordResetSuccessModal(this.getEndpoint()));
  }

  render () {
    let loading = this.props.auth.getIn(["updatePasswordModal", this.getEndpoint(), "loading"]),
        endpoint = this.getEndpoint(),
        errors = this.props.auth.getIn(['updatePasswordModal', this.getEndpoint(), 'errors']);

    return (
      <Modal
        show={this.props.show}
        className="password-reset-success-modal"
        onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title || 'Reset Your Password'}</Modal.Title>
          <p className="message">
            {errors && errors.size > 0 && errors.get(0)}
          </p>
        </Modal.Header>

        <form className="redux-auth password-reset-success-form">
          <Modal.Body>
            <Input
              type="password"
              label="Password"
              placeholder="Password"
              disabled={loading}
              className="password-reset-success-modal-password"
              value={this.props.auth.getIn(["updatePasswordModal", endpoint, "form", "password"])}
              errors={this.props.auth.getIn(["updatePasswordModal", endpoint, "errors", "password"])}
              onChange={this.handleInput.bind(this, "password")}
              {...this.props.inputProps.password} />

            <Input
              type="password"
              label="Password Confirmation"
              placeholder="Password Confirmation"
              disabled={loading}
              className="password-reset-success-modal-password-confirmation"
              value={this.props.auth.getIn(["updatePasswordModal", endpoint, "form", "password_confirmation"])}
              errors={this.props.auth.getIn(["updatePasswordModal", endpoint, "errors", "password_confirmation"])}
              onChange={this.handleInput.bind(this, "password_confirmation")}
              {...this.props.inputProps.passwordConfirmation} />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="password-reset-success-modal-close"
              onClick={this.close.bind(this)}
              {...this.props.inputProps.cancel}>
              Cancel
            </Button>

            <ButtonLoader
              {...this.props}
              loading={loading}
              type="submit"
              className="password-reset-success-modal-submit"
              icon={null}
              onClick={this.handleSubmit.bind(this)}
              {...this.props.inputProps.submit} />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default connect(({auth}) => ({auth}))(PasswordResetSuccessModal);
